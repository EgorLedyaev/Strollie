package ru.riveo.messenger_service.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.riveo.messenger_service.api.request.CreateChatRequest;
import ru.riveo.messenger_service.api.response.MessageResponse;

import java.util.List;
import java.util.UUID;

@Tag(name = "Chat API", description = "Методы для управления чатами")
@RequestMapping("/chats")
@SecurityRequirement(name = "Bearer Authentication")
public interface ChatApi {

    @PostMapping
    @Operation(summary = "Создать чат", description = "Создает новый чат")
    @ApiResponse(responseCode = "201", description = "Чат успешно создан")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    ResponseEntity<Void> createChat(@RequestBody CreateChatRequest request, Authentication authentication);

    @DeleteMapping("/{chatId}")
    @Operation(summary = "Удалить чат", description = "Удаляет указанный чат")
    @ApiResponse(responseCode = "200", description = "Чат успешно удален")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    @ApiResponse(responseCode = "403", description = "У вас недостаточна прав", content = @Content)
    ResponseEntity<Void> deleteChat(@PathVariable UUID chatId, Authentication authentication);

    @PostMapping("/{chatId}/users/{userId}")
    @Operation(summary = "Добавить пользователя в чат", description = "Добавляет указанного пользователя в чат")
    @ApiResponse(responseCode = "200", description = "Пользователь успешно добавлен")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    ResponseEntity<Void> addUserToChat(@PathVariable UUID chatId, @PathVariable UUID userId, Authentication authentication);

    @DeleteMapping("/{chatId}/users/{userId}")
    @Operation(summary = "Удалить пользователя из чата", description = "Удаляет пользователя из чата")
    @ApiResponse(responseCode = "200", description = "Пользователь успешно исключен")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    @ApiResponse(responseCode = "403", description = "У вас недостаточно прав", content = @Content)
    ResponseEntity<Void> removeUserFromChat(@PathVariable UUID chatId, @PathVariable UUID userId, Authentication authentication);

    @Operation(summary = "Получить сообщения чата", description = "Возвращает список сообщений в чате с пагинацией.")
    @ApiResponse(responseCode = "200", description = "Список сообщений успешно получен")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    @ApiResponse(responseCode = "403", description = "У вас недостаточно прав", content = @Content)
    @ApiResponse(responseCode = "404", description = "Чат не найден", content = @Content)
    @GetMapping("/{chatId}/messages")
    ResponseEntity<List<MessageResponse>> getChatMessages(
            @PathVariable UUID chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    );

}
