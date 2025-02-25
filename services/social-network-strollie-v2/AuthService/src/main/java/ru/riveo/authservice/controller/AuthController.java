package ru.riveo.authservice.controller;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.riveo.authservice.controller.request.UserLoginRequest;
import ru.riveo.authservice.controller.request.UserRegistrationRequest;
import ru.riveo.authservice.service.KeycloakService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final KeycloakService keycloakService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationRequest registrationRequest) {
        try {
            Response response = keycloakService.registerUser(registrationRequest);
            if (response.getStatus() == 201) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body("User registered successfully with username: " + registrationRequest.getUsername());
            } else {
                return ResponseEntity.status(response.getStatus())
                        .body("Failed to register user: " + response.getStatusInfo().getReasonPhrase());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during registration: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AccessTokenResponse> loginUser(@RequestBody UserLoginRequest loginRequest) {
        try {
            AccessTokenResponse tokenResponse = keycloakService.loginUser(loginRequest);
            return ResponseEntity.ok(tokenResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
    }

}

