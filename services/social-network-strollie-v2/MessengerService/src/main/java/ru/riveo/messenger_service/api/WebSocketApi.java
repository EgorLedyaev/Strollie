package ru.riveo.messenger_service.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.riveo.messenger_service.api.wsentity.MessageWs;

import java.util.UUID;

@Tag(name = "WebSocket API", description = "WebSocket API для чатов и уведомлений")
@RequestMapping("/ws")
public interface WebSocketApi {

    @Operation(
            summary = "Подключение к WebSocket",
            description = "Подключение по ws://server:port/ws. Используется для реального времени."
    )
    @ApiResponse(responseCode = "101", description = "WebSocket подключение установлено")
    @ApiResponse(responseCode = "401", description = "Пользователь не аутентифицирован", content = @Content)
    @GetMapping("/connect")
    ResponseEntity<Void> connect();

    @Operation(
            summary = "Подписка на сообщения в чате",
            description = "Клиент подписывается на `/topic/chats/{chatId}`, чтобы получать новые сообщения в чате."
    )
    @ApiResponse(responseCode = "200", description = "Подписка оформлена")
    @GetMapping("/subscribe/chat/{chatId}")
    ResponseEntity<Void> subscribeToChat(@PathVariable UUID chatId);

    @Operation(
            summary = "Отправка сообщения",
            description = "Отправка сообщения в чат через WebSocket по адресу `/app/chats/{chatId}/messages`."
    )
    @ApiResponse(responseCode = "200", description = "Сообщение отправлено")
    @PostMapping("/send/chat/{chatId}")
    ResponseEntity<Void> sendMessage(@PathVariable UUID chatId, @RequestBody MessageWs request);

}
