package ru.riveo.strollie.authorization_server.features.user_registration;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

public record RegisterUserCommand(
        @NotBlank(message = "Email is required") @Email(message = "Email should be valid") String email,

        @NotBlank(message = "First name is required") String firstName,

        @NotBlank(message = "Last name is required") String lastName,

        @NotBlank(message = "City is required") String city,

        @NotNull(message = "Date of birth is required") @Past(message = "Date of birth must be in the past") LocalDate dateOfBirth,

        @NotBlank(message = "Nickname is required") String nickname) {
}
