package com.strollie.auth.web;

import com.nimbusds.jose.jwk.JWKSet;
import com.strollie.auth.model.User;
import com.strollie.auth.repo.UserRepository;
import com.strollie.auth.service.KeyProvider;
import com.strollie.auth.service.MailService;
import com.strollie.auth.service.OtpService;
import com.strollie.auth.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Validated
public class AuthController {
    private final UserRepository users;
    private final OtpService otpService;
    private final TokenService tokenService;
    private final KeyProvider keyProvider;
    private final MailService mailService;

    public AuthController(
            UserRepository users,
            OtpService otpService,
            TokenService tokenService,
            KeyProvider keyProvider,
            MailService mailService) {
        this.users = users;
        this.otpService = otpService;
        this.tokenService = tokenService;
        this.keyProvider = keyProvider;
        this.mailService = mailService;
    }

    @PostMapping("/auth/request-code")
    public ResponseEntity<?> requestCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "email required"));
        }
        users.findByEmail(email).orElseGet(() -> users.save(new User(email)));
        String code = otpService.generateAndStoreCode(email);
        mailService.sendOtp(email, code, 10);
        String masked = email.replaceAll("(^.{2}|(?!^).(?=[^@]*@))", "*");
        return ResponseEntity.ok(Map.of("status", "sent", "to", masked));
    }

    @PostMapping("/auth/verify-code")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");
        if (email == null || code == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email and code required"));
        }
        boolean ok = otpService.verify(email, code);
        if (!ok) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid_code"));
        }
        otpService.invalidate(email);
        String access = tokenService.issueAccessToken(email);
        String refresh = tokenService.issueRefreshToken(email);
        return ResponseEntity.ok(Map.of("access_token", access, "refresh_token", refresh, "token_type", "Bearer"));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refresh = body.get("refresh_token");
        if (refresh == null || refresh.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "refresh_token required"));
        }
        try {
            String access = tokenService.refreshAccessToken(refresh);
            return ResponseEntity.ok(Map.of("access_token", access, "token_type", "Bearer"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid_refresh_token"));
        }
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        String refresh = body.get("refresh_token");
        if (refresh == null || refresh.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "refresh_token required"));
        }
        tokenService.revokeRefreshToken(refresh);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/oauth/jwks")
    public Map<String, Object> jwks() {
        JWKSet jwkSet = keyProvider.getJwkSet();
        return jwkSet.toJSONObject();
    }

}