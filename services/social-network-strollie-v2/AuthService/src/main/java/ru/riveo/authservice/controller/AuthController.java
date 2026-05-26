package ru.riveo.authservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import ru.riveo.authservice.controller.request.UserLoginRequest;
import ru.riveo.authservice.controller.request.UserRegistrationRequest;
import ru.riveo.authservice.service.KeycloakService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication API", description = "API для регистрации и аутентификации пользователей через Keycloak")
public class AuthController {

    private final KeycloakService keycloakService;

    @Operation(
            summary = "Регистрация нового пользователя",
            description = "Создает нового пользователя в Keycloak и возвращает статус операции.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Пользователь успешно зарегистрирован"),
                    @ApiResponse(responseCode = "400", description = "Ошибка в запросе"),
                    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
            }
    )
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

    @Operation(
            summary = "Аутентификация пользователя",
            description = "Позволяет пользователю войти в систему, используя учетные данные.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Успешная аутентификация",
                            content = @Content(schema = @Schema(implementation = AccessTokenResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Неверные учетные данные"),
                    @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
            }
    )
    @PostMapping("/login")
    public ResponseEntity<AccessTokenResponse> loginUser(@RequestBody UserLoginRequest loginRequest) {
        try {
            AccessTokenResponse tokenResponse = keycloakService.loginUser(loginRequest);
            return ResponseEntity.ok(tokenResponse);
        } catch (HttpClientErrorException.Unauthorized e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
    }
}
