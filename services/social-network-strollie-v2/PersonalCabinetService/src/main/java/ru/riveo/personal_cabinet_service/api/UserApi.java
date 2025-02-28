package ru.riveo.personal_cabinet_service.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.riveo.personal_cabinet_service.api.request.NicknameRequest;
import ru.riveo.personal_cabinet_service.api.request.StatusRequest;

@Tag(name = "User API", description = "Методы для работы пользователя с личным кабинетом")
@RequestMapping("/user/me")
@SecurityRequirement(name = "bearerAuth")
public interface UserApi {

    @PutMapping("/nickname")
    @Operation(summary = "Сменить nickname", description = "Позволяет пользователю сменить свой nickname")
    @ApiResponse(responseCode = "200", description = "Nickname изменен")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    ResponseEntity<Void> updateNickname(@RequestBody NicknameRequest request, Authentication authentication);

    @PutMapping("/status")
    @Operation(summary = "Сменить статус", description = "Позволяет пользователю сменить свой статус")
    @ApiResponse(responseCode = "200", description = "Статус изменен")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    ResponseEntity<Void> updateStatus(@RequestBody StatusRequest request, Authentication authentication);

    @PostMapping("/avatar")
    @Operation(summary = "Загрузить аватар", description = "Загружает новый аватар пользователя")
    @ApiResponse(responseCode = "200", description = "Аватар загружен", content = @Content(mediaType = "text/plain", schema = @Schema(type = "string")))
    @ApiResponse(responseCode = "400", description = "Ошибка загрузки файла", content = @Content)
    ResponseEntity<String> uploadAvatar(@RequestParam MultipartFile file, Authentication authentication);

    @DeleteMapping("/avatar")
    @Operation(summary = "Удалить аватар", description = "Удаляет текущий аватар пользователя")
    @ApiResponse(responseCode = "200", description = "Аватар удален")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    ResponseEntity<Void> deleteAvatar(Authentication authentication);
}
