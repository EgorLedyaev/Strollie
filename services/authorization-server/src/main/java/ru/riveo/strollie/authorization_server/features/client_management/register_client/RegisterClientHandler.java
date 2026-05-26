package ru.riveo.strollie.authorization_server.features.client_management.register_client;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegisterClientHandler {

    private final RegisteredClientRepository registeredClientRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public RegisterClientResponse handle(RegisterClientCommand command) {
        String clientId = UUID.randomUUID().toString();
        String rawClientSecret = generateSecureSecret();

        RegisteredClient registeredClient = RegisteredClient.withId(UUID.randomUUID().toString())
                .clientId(clientId)
                .clientSecret(passwordEncoder.encode(rawClientSecret))
                .clientName(command.clientName())
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantTypes(grantTypes -> grantTypes.addAll(
                        command.grantTypes().stream()
                                .map(AuthorizationGrantType::new)
                                .collect(Collectors.toSet())))
                .redirectUris(uris -> uris.addAll(command.redirectUris()))
                .scopes(scope -> scope.addAll(command.scopes()))
                .clientSettings(ClientSettings.builder()
                        .requireProofKey(true) // Включаем PKCE - это стандарт безопасности
                        .requireAuthorizationConsent(false) // Не запрашиваем согласие каждый раз
                        .build())
                .tokenSettings(TokenSettings.builder()
                        .accessTokenTimeToLive(Duration.ofHours(1))
                        .refreshTokenTimeToLive(Duration.ofDays(30))
                        .reuseRefreshTokens(true)
                        .build())
                .build();

        registeredClientRepository.save(registeredClient);

        return new RegisterClientResponse(clientId, rawClientSecret);
    }

    private String generateSecureSecret() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32]; // 256 bits
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
