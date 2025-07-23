package ru.riveo.strollie.authorization_server.features.client_management.register_client;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record RegisterClientCommand(
        @NotBlank(message = "Client name is required") String clientName,

        @NotEmpty(message = "At least one grant type is required") Set<String> grantTypes, // e.g.,
                                                                                           // "authorization_code",
                                                                                           // "refresh_token"

        @NotEmpty(message = "At least one redirect URI is required for authorization_code flow") Set<String> redirectUris,

        @NotEmpty(message = "At least one scope is required") Set<String> scopes // e.g., "openid", "profile"
) {
}
