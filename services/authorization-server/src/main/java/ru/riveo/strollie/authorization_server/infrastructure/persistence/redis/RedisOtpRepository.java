package ru.riveo.strollie.authorization_server.infrastructure.persistence.redis;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.OtpRepository;

@Repository
@RequiredArgsConstructor
public class RedisOtpRepository implements OtpRepository {

    private static final String OTP_KEY_PREFIX = "otp:";
    private static final String ATTEMPTS_KEY_PREFIX = "otp_attempts:";
    private static final String RATE_LIMIT_KEY_PREFIX = "otp_rate_limit:";

    private final StringRedisTemplate redisTemplate;

    @Override
    public void saveOtp(String email, String otp, long expiryMinutes) {
        String otpKey = OTP_KEY_PREFIX + email;
        redisTemplate.opsForValue().set(otpKey, otp, expiryMinutes, TimeUnit.MINUTES);
    }

    @Override
    public Optional<String> findOtp(String email) {
        String otpKey = OTP_KEY_PREFIX + email;
        String storedOtp = redisTemplate.opsForValue().get(otpKey);
        return Optional.ofNullable(storedOtp);
    }

    @Override
    public void deleteOtp(String email) {
        String otpKey = OTP_KEY_PREFIX + email;
        redisTemplate.delete(otpKey);
    }

    @Override
    public void setInitialAttempts(String email, int maxAttempts, long expiryMinutes) {
        String attemptsKey = ATTEMPTS_KEY_PREFIX + email;
        redisTemplate.opsForValue().set(attemptsKey, String.valueOf(maxAttempts), expiryMinutes, TimeUnit.MINUTES);
    }

    @Override
    public long decrementAndGetAttempts(String email) {
        String attemptsKey = ATTEMPTS_KEY_PREFIX + email;
        Long remaining = redisTemplate.opsForValue().decrement(attemptsKey);
        return remaining != null ? remaining : -1L;
    }

    @Override
    public void deleteAttempts(String email) {
        String attemptsKey = ATTEMPTS_KEY_PREFIX + email;
        redisTemplate.delete(attemptsKey);
    }

    @Override
    public boolean isRateLimited(String email) {
        String rateLimitKey = RATE_LIMIT_KEY_PREFIX + email;
        return Boolean.TRUE.equals(redisTemplate.hasKey(rateLimitKey));
    }

    @Override
    public void setRateLimit(String email, long durationSeconds) {
        String rateLimitKey = RATE_LIMIT_KEY_PREFIX + email;
        redisTemplate.opsForValue().set(rateLimitKey, "locked", durationSeconds, TimeUnit.SECONDS);
    }

    @Override
    public void clearRateLimit(String email) {
        String rateLimitKey = RATE_LIMIT_KEY_PREFIX + email;
        redisTemplate.delete(rateLimitKey);
    }
}
