package ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp;

import java.util.Optional;

public interface OtpRepository {
    void saveOtp(String email, String otp, long expiryMinutes);

    Optional<String> findOtp(String email);

    void deleteOtp(String email);

    // Переименовываем метод, чтобы он отражал его фактическую функцию
    void setInitialAttempts(String email, int maxAttempts, long expiryMinutes);

    // Заменяем метод на атомарную операцию
    long decrementAndGetAttempts(String email);

    void deleteAttempts(String email);

    boolean isRateLimited(String email);

    void setRateLimit(String email, long durationSeconds);

    void clearRateLimit(String email);
}
