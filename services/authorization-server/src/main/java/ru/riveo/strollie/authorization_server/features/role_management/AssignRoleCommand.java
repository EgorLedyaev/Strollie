package ru.riveo.strollie.authorization_server.features.role_management;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AssignRoleCommand(
        @NotBlank @Email String email,
        @NotBlank String role // e.g., "ROLE_ADMIN"
) {
}
