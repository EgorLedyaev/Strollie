package ru.riveo.strollie.authorization_server.infrastructure.system;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.admin")
public record AdminProperties(
        @NotBlank @Email String email,
        @NotBlank String nickname
) {
}
