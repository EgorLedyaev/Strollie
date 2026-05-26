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
import ru.riveo.personal_cabinet_service.api.request.StatusRequest;
import ru.riveo.personal_cabinet_service.api.request.UsernameRequest;

@Tag(name = "User API", description = "Методы для работы пользователя с личным кабинетом")
@RequestMapping("/user")
@SecurityRequirement(name = "bearerAuth")
public interface UserApi {

    @PutMapping("/{userId}/nickname")
    @Operation(summary = "Сменить nickname", description = "Позволяет пользователю сменить свой nickname. Можно изменять только свой никнейм.")
    @ApiResponse(responseCode = "200", description = "Nickname изменен")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    @ApiResponse(responseCode = "403", description = "Невозможно изменить данные другого пользователя", content = @Content)
    ResponseEntity<Void> updateNickname(@PathVariable("userId") Long userId, @RequestBody UsernameRequest request, Authentication authentication);

    @PutMapping("/{userId}/status")
    @Operation(summary = "Сменить статус", description = "Позволяет пользователю сменить свой статус. Можно изменять только свой статус.")
    @ApiResponse(responseCode = "200", description = "Статус изменен")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    @ApiResponse(responseCode = "403", description = "Невозможно изменить данные другого пользователя", content = @Content)
    ResponseEntity<Void> updateStatus(@PathVariable("userId") Long userId, @RequestBody StatusRequest request, Authentication authentication);

    @PostMapping("/{userId}/avatar")
    @Operation(summary = "Загрузить аватар", description = "Загружает новый аватар пользователя. Можно загружать аватар только для себя.")
    @ApiResponse(responseCode = "200", description = "Аватар загружен", content = @Content(mediaType = "text/plain", schema = @Schema(type = "string")))
    @ApiResponse(responseCode = "400", description = "Ошибка загрузки файла", content = @Content)
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    @ApiResponse(responseCode = "403", description = "Невозможно загрузить аватар другого пользователя", content = @Content)
    ResponseEntity<String> uploadAvatar(@PathVariable("userId") Long userId, @RequestParam MultipartFile file, Authentication authentication);

    @DeleteMapping("/{userId}/avatar")
    @Operation(summary = "Удалить аватар", description = "Удаляет текущий аватар пользователя. Можно удалять аватар только для себя.")
    @ApiResponse(responseCode = "200", description = "Аватар удален")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    @ApiResponse(responseCode = "403", description = "Невозможно удалить аватар другого пользователя", content = @Content)
    ResponseEntity<Void> deleteAvatar(@PathVariable("userId") Long userId, Authentication authentication);

    @GetMapping("/{userId}/avatar")
    @Operation(summary = "Получить аватар", description = "Возвращает URL текущего аватара пользователя")
    @ApiResponse(responseCode = "200", description = "Аватар найден", content = @Content(mediaType = "application/json", schema = @Schema(type = "string")))
    @ApiResponse(responseCode = "404", description = "Аватар не найден", content = @Content)
    ResponseEntity<String> getAvatarUrl(@PathVariable("userId") Long userId, Authentication authentication);

    @GetMapping("/{userId}/nickname")
    @Operation(summary = "Получить nickname", description = "Возвращает текущий nickname пользователя")
    @ApiResponse(responseCode = "200", description = "Никнейм найден", content = @Content(mediaType = "application/json", schema = @Schema(type = "string")))
    @ApiResponse(responseCode = "404", description = "Никнейм не найден", content = @Content)
    ResponseEntity<String> getNickname(@PathVariable("userId") Long userId, Authentication authentication);

    @GetMapping("/{userId}/status")
    @Operation(summary = "Получить статус", description = "Возвращает текущий статус пользователя")
    @ApiResponse(responseCode = "200", description = "Статус найден", content = @Content(mediaType = "application/json", schema = @Schema(type = "string")))
    @ApiResponse(responseCode = "404", description = "Статус не найден", content = @Content)
    ResponseEntity<String> getStatus(@PathVariable("userId") Long userId, Authentication authentication);
}
