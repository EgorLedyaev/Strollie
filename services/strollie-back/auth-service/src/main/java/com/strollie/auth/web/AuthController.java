package com.strollie.auth.web;

import com.nimbusds.jose.jwk.JWKSet;
import com.strollie.auth.model.User;
import com.strollie.auth.repo.UserRepository;
import com.strollie.auth.service.KeyProvider;
import com.strollie.auth.service.MailService;
import com.strollie.auth.service.OtpService;
import com.strollie.auth.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.strollie.auth.web.request.RequestCodeRequest;
import com.strollie.auth.web.request.VerifyCodeRequest;
import com.strollie.auth.web.request.RefreshRequest;
import com.strollie.auth.web.request.LogoutRequest;
import com.strollie.auth.web.response.RequestCodeResponse;
import com.strollie.auth.web.response.VerifyCodeResponse;
import com.strollie.auth.web.response.RefreshResponse;
import com.strollie.auth.web.response.LogoutResponse;
import com.strollie.auth.web.response.ErrorResponse;
import com.strollie.auth.web.response.JwksResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Validated
@Tag(name = "Auth", description = "Эндпоинты аутентификации и управления токенами")
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
    @Operation(
            summary = "Запросить OTP-код для входа",
            description = "Создаёт пользователя при необходимости, генерирует OTP и отправляет на email",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = RequestCodeRequest.class),
                            examples = {
                                    @ExampleObject(value = "{\"email\":\"user@test.local\"}")
                            }
                    )
            )
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Код отправлен", content = @Content(schema = @Schema(implementation = RequestCodeResponse.class))),
            @ApiResponse(responseCode = "400", description = "Неверный запрос", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
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
    @Operation(
            summary = "Подтвердить OTP-код",
            description = "Верифицирует OTP и выдаёт пару токенов",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = VerifyCodeRequest.class),
                            examples = {
                                    @ExampleObject(value = "{\"email\":\"user@test.local\",\"code\":\"123456\"}")
                            }
                    )
            )
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Успешная аутентификация", content = @Content(schema = @Schema(implementation = VerifyCodeResponse.class))),
            @ApiResponse(responseCode = "400", description = "Отсутствуют поля", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Неверный код", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
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
    @Operation(
            summary = "Обновить access-токен",
            description = "По валидному refresh-токену выдаёт новый access-токен",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = RefreshRequest.class),
                            examples = {
                                    @ExampleObject(value = "{\"refresh_token\":\"<uuid>\"}")
                            }
                    )
            )
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Новый access-токен", content = @Content(schema = @Schema(implementation = RefreshResponse.class))),
            @ApiResponse(responseCode = "401", description = "Некорректный refresh-токен", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refresh = body.get("refresh_token");
        if (refresh == null || refresh.isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "refresh_token required");
        }
        try {
            String access = tokenService.refreshAccessToken(refresh);
            return ResponseEntity.ok(Map.of("access_token", access, "token_type", "Bearer"));
        } catch (IllegalArgumentException e) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "invalid_refresh_token");
        }
    }

    @PostMapping("/auth/logout")
    @Operation(
            summary = "Выйти из системы",
            description = "Отзывает refresh-токен",
            requestBody = @RequestBody(
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = LogoutRequest.class),
                            examples = {
                                    @ExampleObject(value = "{\"refresh_token\":\"<uuid>\"}")
                            }
                    )
            )
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Выход выполнен", content = @Content(schema = @Schema(implementation = LogoutResponse.class))),
            @ApiResponse(responseCode = "400", description = "Отсутствует refresh_token", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        String refresh = body.get("refresh_token");
        if (refresh == null || refresh.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "refresh_token required"));
        }
        tokenService.revokeRefreshToken(refresh);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/oauth/jwks")
    @Operation(
            summary = "Опубликовать JWKS",
            description = "Возвращает набор публичных ключей для проверки JWT"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "JWKS", content = @Content(schema = @Schema(implementation = JwksResponse.class)))
    })
    public Map<String, Object> jwks() {
        JWKSet jwkSet = keyProvider.getJwkSet();
        return jwkSet.toJSONObject();
    }

}