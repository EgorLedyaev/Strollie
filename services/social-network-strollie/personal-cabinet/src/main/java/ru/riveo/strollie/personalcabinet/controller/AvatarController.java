package ru.riveo.strollie.personalcabinet.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.riveo.strollie.personalcabinet.exception.AvatarNotFoundException;
import ru.riveo.strollie.personalcabinet.service.AvatarService;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/api/avatar")
public class AvatarController {

    private final AvatarService avatarService;

    @PostMapping("/")
    public ResponseEntity<String> uploadAvatar(@AuthenticationPrincipal Jwt jwt,
                                               @RequestParam("file") MultipartFile file) {
        UUID userId = extractUserId(jwt);

        try {
            String avatarUrl = avatarService.uploadAvatar(userId, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(avatarUrl);
        } catch (Exception e) {
            log.error("Error uploading avatar for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading avatar: " + e.getMessage());
        }
    }

    @DeleteMapping("/")
    public ResponseEntity<String> deleteAvatar(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = extractUserId(jwt);

        try {
            avatarService.deleteAvatar(userId);
            return ResponseEntity.ok("Avatar deleted successfully");
        } catch (AvatarNotFoundException e) {
            log.warn("Avatar not found for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<String> getAvatar(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(avatarService.getAvatar(extractUserId(jwt)));
    }

    ;

    private UUID extractUserId(Jwt jwt) {
        if (jwt == null) {
            throw new RuntimeException("User is not authenticated");
        }

        String userIdString = jwt.getClaimAsString("sub");
        log.info("Extracted user_id: {}", userIdString);

        try {
            return UUID.fromString(userIdString);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid user ID format", e);
        }
    }
}