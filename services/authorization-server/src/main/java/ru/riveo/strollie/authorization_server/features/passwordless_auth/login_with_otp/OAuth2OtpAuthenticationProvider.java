package ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.security.oauth2.core.OAuth2Token;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.authorization.OAuth2Authorization;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AccessTokenAuthenticationToken;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2ClientAuthenticationToken;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.context.AuthorizationServerContextHolder;
import org.springframework.security.oauth2.server.authorization.token.DefaultOAuth2TokenContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ru.riveo.strollie.authorization_server.shared.security.OtpAuthenticationProvider;
import ru.riveo.strollie.authorization_server.shared.security.OtpAuthenticationToken;

/**
 * Провайдер аутентификации, который преобразует OtpAuthenticationToken
 * в OAuth2AccessTokenAuthenticationToken для выдачи токенов доступа
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2OtpAuthenticationProvider implements AuthenticationProvider {

    private static final String OTP_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:otp"; // Используем URN формат
                                                                                         // согласно RFC 6749

    private final OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator;
    private final OAuth2AuthorizationService authorizationService;
    private final OtpAuthenticationProvider otpAuthenticationProvider;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (!supports(authentication.getClass())) {
            return null;
        }

        log.debug("Processing OtpAuthentication request");

        // 1. Получаем аутентифицированного клиента из контекста безопасности
        Authentication clientPrincipal = SecurityContextHolder.getContext().getAuthentication();
        if (!(clientPrincipal instanceof OAuth2ClientAuthenticationToken clientAuthentication)) {
            log.error("No client authentication found in SecurityContextHolder");
            throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_CLIENT);
        }

        RegisteredClient registeredClient = clientAuthentication.getRegisteredClient();
        if (registeredClient == null) {
            log.error("RegisteredClient is null in ClientAuthentication");
            throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_CLIENT);
        }

        // 2. Делегируем проверку OTP стандартному OtpAuthenticationProvider
        OtpAuthenticationToken otpAuthentication = (OtpAuthenticationToken) authentication;
        Authentication userAuthentication;

        try {
            userAuthentication = otpAuthenticationProvider.authenticate(otpAuthentication);
            if (userAuthentication == null || !userAuthentication.isAuthenticated()) {
                log.error("OTP authentication failed - null or not authenticated");
                OAuth2Error error = new OAuth2Error(
                        OAuth2ErrorCodes.INVALID_GRANT,
                        "Invalid OTP code",
                        "https://datatracker.ietf.org/doc/html/rfc6749#section-5.2");
                throw new OAuth2AuthenticationException(error);
            }
        } catch (AuthenticationException ex) {
            log.error("OTP authentication failed with exception: {}", ex.getMessage());
            OAuth2Error error = new OAuth2Error(
                    OAuth2ErrorCodes.INVALID_GRANT,
                    "Invalid OTP code",
                    "https://datatracker.ietf.org/doc/html/rfc6749#section-5.2");
            throw new OAuth2AuthenticationException(error);
        }

        log.debug("OTP authentication successful for user: {}", userAuthentication.getName());

        // 3. Создаем токены с использованием стандартного OAuth2 механизма
        // Создаем Access Token
        OAuth2TokenContext tokenContext = DefaultOAuth2TokenContext.builder()
                .registeredClient(registeredClient)
                .principal(userAuthentication)
                .authorizationServerContext(AuthorizationServerContextHolder.getContext())
                .authorizedScopes(registeredClient.getScopes())
                .tokenType(OAuth2TokenType.ACCESS_TOKEN)
                .authorizationGrantType(new AuthorizationGrantType(OTP_GRANT_TYPE))
                .build();

        OAuth2Token generatedToken = tokenGenerator.generate(tokenContext);
        if (generatedToken == null) {
            log.error("Failed to generate access token");
            throw new OAuth2AuthenticationException(OAuth2ErrorCodes.SERVER_ERROR);
        }

        // В этой реализации используется JWT для токенов доступа
        // Используем правильное приведение типа для JWT
        Jwt jwt = (Jwt) generatedToken;
        OAuth2AccessToken accessToken = new OAuth2AccessToken(
                OAuth2AccessToken.TokenType.BEARER,
                jwt.getTokenValue(),
                jwt.getIssuedAt(),
                jwt.getExpiresAt());

        // Создаем Refresh Token, если поддерживается
        OAuth2RefreshToken refreshToken = null;
        if (registeredClient.getAuthorizationGrantTypes().contains(AuthorizationGrantType.REFRESH_TOKEN)) {
            DefaultOAuth2TokenContext refreshTokenContext = DefaultOAuth2TokenContext.builder()
                    .registeredClient(registeredClient)
                    .principal(userAuthentication)
                    .authorizationServerContext(AuthorizationServerContextHolder.getContext())
                    .tokenType(OAuth2TokenType.REFRESH_TOKEN)
                    .authorizationGrantType(new AuthorizationGrantType(OTP_GRANT_TYPE))
                    .build();

            OAuth2Token generatedRefreshToken = tokenGenerator.generate(refreshTokenContext);
            if (!(generatedRefreshToken instanceof OAuth2RefreshToken)) {
                log.error("Generated token is not of type OAuth2RefreshToken");
                throw new OAuth2AuthenticationException(OAuth2ErrorCodes.SERVER_ERROR);
            }
            refreshToken = (OAuth2RefreshToken) generatedRefreshToken;
        }

        // Сохраняем авторизацию
        OAuth2Authorization.Builder authorizationBuilder = OAuth2Authorization.withRegisteredClient(registeredClient)
                .principalName(userAuthentication.getName())
                .authorizationGrantType(new AuthorizationGrantType(OTP_GRANT_TYPE))
                .attribute(Principal.class.getName(), userAuthentication);

        // Сохраняем и JWT, и AccessToken
        authorizationBuilder
                .token(jwt, (metadata) -> metadata.put(OAuth2Authorization.Token.CLAIMS_METADATA_NAME, jwt.getClaims()))
                .accessToken(accessToken);

        if (refreshToken != null) {
            authorizationBuilder.refreshToken(refreshToken);
        }

        OAuth2Authorization authorization = authorizationBuilder.build();
        authorizationService.save(authorization);
        log.debug("OAuth2 authorization saved successfully");

        // Возвращаем OAuth2AccessTokenAuthenticationToken с токенами
        Map<String, Object> additionalParams = new HashMap<>();
        return new OAuth2AccessTokenAuthenticationToken(
                registeredClient,
                clientAuthentication, // Важно: передаем аутентифицированного клиента
                accessToken,
                refreshToken,
                additionalParams);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return OtpAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
