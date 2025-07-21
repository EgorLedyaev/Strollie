package ru.riveo.strollie.authorization_server.controller;


import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.security.oauth2.core.OAuth2Token;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.authorization.OAuth2Authorization;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.context.AuthorizationServerContext;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.oauth2.server.authorization.token.DefaultOAuth2TokenContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.riveo.strollie.authorization_server.service.OtpService;
import ru.riveo.strollie.authorization_server.service.UserService;

import java.security.Principal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final OtpService otpService;
    private final UserService userService;
    private final RegisteredClientRepository registeredClientRepository;
    private final OAuth2AuthorizationService authorizationService;
    private final OAuth2TokenGenerator<?> tokenGenerator;
    private final AuthorizationServerSettings authorizationServerSettings;

    @PostMapping("/request-otp")
    public ResponseEntity<Void> requestOtp(@Valid @RequestBody OtpRequest request) {
        try {
            otpService.requestOtp(request.getEmail());
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(429).build(); // 429 Too Many Requests
        }
    }

    @PostMapping("/login-otp")
    public ResponseEntity<?> loginWithOtp(@Valid @RequestBody LoginRequest request) {
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
            throw new BadCredentialsException("Invalid OTP code.");
        }

        UserDetails user = userService.loadUserByUsername(request.getEmail());
        RegisteredClient registeredClient = registeredClientRepository.findByClientId(request.getClientId());
        if (registeredClient == null) {
            throw new BadCredentialsException("Invalid client ID.");
        }

        AuthorizationServerContext authorizationServerContext = new AuthorizationServerContext() {
            @Override
            public String getIssuer() {
                return authorizationServerSettings.getIssuer();
            }

            @Override
            public AuthorizationServerSettings getAuthorizationServerSettings() {
                return authorizationServerSettings;
            }
        };

        Authentication userPrincipal = UsernamePasswordAuthenticationToken.authenticated(user, null, user.getAuthorities());

        DefaultOAuth2TokenContext tokenContext = DefaultOAuth2TokenContext.builder()
                .registeredClient(registeredClient)
                .principal(userPrincipal)
                .authorizationServerContext(authorizationServerContext)
                .authorizedScopes(registeredClient.getScopes())
                .tokenType(OAuth2TokenType.ACCESS_TOKEN)
                .build();

        OAuth2Token generatedToken = tokenGenerator.generate(tokenContext);
        if (generatedToken == null) {
            throw new RuntimeException("Token generation failed");
        }

        Jwt accessToken = (Jwt) generatedToken;

        OAuth2RefreshToken refreshToken = null;
        if (registeredClient.getAuthorizationGrantTypes().contains(org.springframework.security.oauth2.core.AuthorizationGrantType.REFRESH_TOKEN)) {
            DefaultOAuth2TokenContext refreshTokenContext = DefaultOAuth2TokenContext.builder()
                    .registeredClient(registeredClient)
                    .principal(userPrincipal)
                    .authorizationServerContext(authorizationServerContext)
                    .tokenType(OAuth2TokenType.REFRESH_TOKEN)
                    .build();
            OAuth2Token generatedRefreshToken = tokenGenerator.generate(refreshTokenContext);
            if (generatedRefreshToken != null) {
                refreshToken = (OAuth2RefreshToken) generatedRefreshToken;
            }
        }

        OAuth2Authorization.Builder authorizationBuilder = OAuth2Authorization.withRegisteredClient(registeredClient)
                .principalName(user.getUsername())
                .authorizationGrantType(new org.springframework.security.oauth2.core.AuthorizationGrantType("passwordless_otp"))
                .authorizedScopes(registeredClient.getScopes())
                .attribute(Principal.class.getName(), userPrincipal);

        authorizationBuilder.token(accessToken, (metadata) ->
                metadata.put(OAuth2Authorization.Token.CLAIMS_METADATA_NAME, accessToken.getClaims()));

        if (refreshToken != null) {
            authorizationBuilder.refreshToken(refreshToken);
        }

        OAuth2Authorization authorization = authorizationBuilder.build();
        authorizationService.save(authorization);

        Map<String, Object> tokenResponse = new HashMap<>();
        tokenResponse.put("access_token", accessToken.getTokenValue());
        tokenResponse.put("token_type", "Bearer");

        long expiresIn = Optional.ofNullable(accessToken.getExpiresAt())
                .map(exp -> exp.getEpochSecond() - Instant.now().getEpochSecond())
                .orElse(0L);
        tokenResponse.put("expires_in", expiresIn);

        tokenResponse.put("scope", String.join(" ", (Set<String>) accessToken.getClaim("scope")));

        if (refreshToken != null) {
            tokenResponse.put("refresh_token", refreshToken.getTokenValue());
        }

        return ResponseEntity.ok(tokenResponse);
    }


    @Data
    static class OtpRequest {
        @Email(message = "Email should be valid")
        private String email;
    }

    @Data
    static class LoginRequest {
        @Email(message = "Email should be valid")
        private String email;
        @NotBlank(message = "OTP cannot be blank")
        private String otp;
        @NotBlank(message = "Client ID cannot be blank")
        private String clientId;
    }

}