package ru.riveo.messenger_service.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.riveo.messenger_service.api.request.MessageRequest;

import java.util.UUID;

@Tag(name = "Message API", description = "Методы для управления чатами")
@RequestMapping("/message/{chatId}")
@SecurityRequirement(name = "Bearer Authentication")
public interface MessageApi {

    @PostMapping
    @Operation(summary = "Отправить сообщение", description = "Отправляет новое сообщение в чат")
    @ApiResponse(responseCode = "201", description = "Сообщение успешно отправлено")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    @ApiResponse(responseCode = "403", description = "У вас недостаточно прав", content = @Content)
    ResponseEntity<Void> sendMessage(@PathVariable UUID chatId, @RequestBody MessageRequest request, Authentication authentication);

    @DeleteMapping("/{messageId}")
    @Operation(summary = "Удалить сообщение", description = "Удаляет сообщение из чата")
    @ApiResponse(responseCode = "200", description = "Сообщение успешно удалено")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    @ApiResponse(responseCode = "403", description = "У вас недостаточно прав", content = @Content)
    @ApiResponse(responseCode = "404", description = "Сообщение не найдено", content = @Content)
    ResponseEntity<Void> deleteMessage(@PathVariable UUID chatId, @PathVariable UUID messageId, Authentication authentication);

    @PutMapping("/{messageId}")
    @Operation(summary = "Редактировать сообщение", description = "Редактирует отправленное сообщение")
    @ApiResponse(responseCode = "200", description = "Сообщение успешно отредактировано")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    @ApiResponse(responseCode = "403", description = "У вас недостаточно прав", content = @Content)
    @ApiResponse(responseCode = "404", description = "Сообщение не найдено", content = @Content)
    ResponseEntity<Void> editMessage(@PathVariable UUID chatId, @PathVariable UUID messageId, @RequestBody MessageRequest request, Authentication authentication);

}
