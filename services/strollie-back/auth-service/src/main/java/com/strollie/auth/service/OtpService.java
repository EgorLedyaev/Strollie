package com.strollie.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {
    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private final StringRedisTemplate redis;
    private final SecureRandom random = new SecureRandom();

    private final long ttlMinutes;

    public OtpService(StringRedisTemplate redis,
                      @Value("${otp.ttl-minutes}") long ttlMinutes) {
        this.redis = redis;
        this.ttlMinutes = ttlMinutes;
    }

    public String generateAndStoreCode(String email) {
        String code = String.format("%06d", random.nextInt(1_000_000));
        String hash = BCrypt.hashpw(code, BCrypt.gensalt());
        String key = otpKey(email);
        redis.opsForValue().set(key, hash, ttlMinutes, TimeUnit.MINUTES);
        log.info("OTP generated for {}: {}", email, code);
        return code;
    }

    public boolean verify(String email, String code) {
        String key = otpKey(email);
        String hash = redis.opsForValue().get(key);
        return hash != null && BCrypt.checkpw(code, hash);
    }

    public void invalidate(String email) {
        redis.delete(otpKey(email));
    }

    private String otpKey(String email) {
        return "otp:" + email;
    }
    
}