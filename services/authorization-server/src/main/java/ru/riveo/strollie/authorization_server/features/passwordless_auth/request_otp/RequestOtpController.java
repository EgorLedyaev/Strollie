package ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
class RequestOtpController {
    
    private final RequestOtpHandler handler;
    
    @PostMapping("/api/auth/request-otp")
    public ResponseEntity<Void> handle(@Valid @RequestBody RequestOtp command) {
        try {
            handler.handle(command);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(429).build(); // 429 Too Many Requests
        }
    }
}
