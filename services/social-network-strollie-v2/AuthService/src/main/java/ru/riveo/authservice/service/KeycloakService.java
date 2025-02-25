package ru.riveo.authservice.service;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.riveo.authservice.controller.request.UserLoginRequest;
import ru.riveo.authservice.controller.request.UserRegistrationRequest;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class KeycloakService {

    private final Keycloak keycloak; // Инжектируем бин из конфигурации

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.server-uri}")
    private String serverUrl;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    public Response registerUser(UserRegistrationRequest userRegistrationRequest) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(userRegistrationRequest.getUsername());
        user.setEmail(userRegistrationRequest.getEmail());
        user.setEnabled(true);
        user.setEmailVerified(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(userRegistrationRequest.getPassword());
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));

        RealmResource realmResource = keycloak.realm(realm);
        return realmResource.users().create(user);
    }

    public AccessTokenResponse loginUser(UserLoginRequest userLoginRequest) {
        Keycloak keycloakForLogin = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .grantType("password")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .grantType(OAuth2Constants.PASSWORD)
                .username(userLoginRequest.getUsername())
                .password(userLoginRequest.getPassword())
                .build();
        try {
            AccessTokenResponse tokenResponse = keycloakForLogin.tokenManager().getAccessToken();
            return tokenResponse;
        } catch (Exception e) {
            throw new RuntimeException("Failed to login user: " + e.getMessage());
        }
    }
}