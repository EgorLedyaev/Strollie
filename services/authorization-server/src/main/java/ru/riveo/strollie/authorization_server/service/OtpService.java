package ru.riveo.strollie.authorization_server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final String OTP_KEY_PREFIX = "otp:";
    private static final String ATTEMPTS_KEY_PREFIX = "otp_attempts:";
    private static final String RATE_LIMIT_KEY_PREFIX = "otp_rate_limit:";

    private final StringRedisTemplate redisTemplate;
    private final OtpGenerator otpGenerator;
    private final EmailService emailService;
    private final UserService userService;

    @Value("${app.otp.lifetime-minutes}")
    private long otpLifetimeMinutes;
    @Value("${app.otp.max-attempts}")
    private int maxAttempts;
    @Value("${app.otp.resend-cooldown-seconds}")
    private long resendCooldownSeconds;

    public void requestOtp(String email) {
        String rateLimitKey = RATE_LIMIT_KEY_PREFIX + email;
        if (Boolean.TRUE.equals(redisTemplate.hasKey(rateLimitKey))) {
            throw new IllegalStateException("Please wait before requesting a new code.");
        }

        String otp = otpGenerator.generate();
        String otpKey = OTP_KEY_PREFIX + email;
        redisTemplate.opsForValue().set(otpKey, otp, otpLifetimeMinutes, TimeUnit.MINUTES);

        String attemptsKey = ATTEMPTS_KEY_PREFIX + email;
        redisTemplate.opsForValue().set(attemptsKey, String.valueOf(maxAttempts));

        emailService.sendOtpEmail(email, otp);
        redisTemplate.opsForValue().set(rateLimitKey, "locked", resendCooldownSeconds, TimeUnit.SECONDS);
    }

    public boolean verifyOtp(String email, String otp) {
        String attemptsKey = ATTEMPTS_KEY_PREFIX + email;
        String otpKey = OTP_KEY_PREFIX + email;
        String rateLimitKey = RATE_LIMIT_KEY_PREFIX + email;

        String storedOtp = redisTemplate.opsForValue().get(otpKey);
        if (storedOtp == null) {
            return false;
        }

        Long attemptsLeft = redisTemplate.opsForValue().decrement(attemptsKey);
        if (attemptsLeft != null && attemptsLeft < 0) {
            return false;
        }

        if (storedOtp.equals(otp)) {
            redisTemplate.delete(otpKey);
            redisTemplate.delete(attemptsKey);
            redisTemplate.delete(rateLimitKey);
            userService.registerUserIfNotFound(email);
            return true;
        }

        return false;
    }

}
