package ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.port;

public interface UserExistenceChecker {
    boolean existsByEmail(String email);
}