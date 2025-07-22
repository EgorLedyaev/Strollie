package ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp;

import jakarta.validation.constraints.Email;

public record RequestOtp(
    @Email(message = "Email should be valid")
    String email
) {}
