package com.strollie.auth.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.interfaces.RSAPrivateKey;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class TokenService {
    
    private final KeyProvider keyProvider;
    private final StringRedisTemplate redis;
    private final String issuer;
    private final long accessTtlMinutes;
    private final long refreshTtlHours;

    public TokenService(KeyProvider keyProvider,
                        StringRedisTemplate redis,
                        @Value("${jwt.issuer}") String issuer,
                        @Value("${jwt.access-token-ttl-minutes}") long accessTtlMinutes,
                        @Value("${jwt.refresh-token-ttl-hours}") long refreshTtlHours) {
        this.keyProvider = keyProvider;
        this.redis = redis;
        this.issuer = issuer;
        this.accessTtlMinutes = accessTtlMinutes;
        this.refreshTtlHours = refreshTtlHours;
    }

    public String issueAccessToken(String subject) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(accessTtlMinutes * 60);
        RSAPrivateKey pk = keyProvider.getPrivateKey();
        return Jwts.builder()
                .setHeaderParam("kid", keyProvider.getKeyId())
                .setIssuer(issuer)
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .signWith(pk, SignatureAlgorithm.RS256)
                .compact();
    }

    public String issueRefreshToken(String subject) {
        String refreshId = UUID.randomUUID().toString();
        String key = refreshKey(refreshId);
        redis.opsForValue().set(key, subject, refreshTtlHours, TimeUnit.HOURS);
        return refreshId;
    }

    public String refreshAccessToken(String refreshId) {
        String subject = redis.opsForValue().get(refreshKey(refreshId));
        if (subject == null) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        return issueAccessToken(subject);
    }

    public void revokeRefreshToken(String refreshId) {
        redis.delete(refreshKey(refreshId));
    }

    private String refreshKey(String id) {
        return "refresh:" + id;
    }

}