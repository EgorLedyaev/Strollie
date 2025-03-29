package ru.riveo.strollie.messenger.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import ru.riveo.strollie.messenger.dto.ChatCreateRequest;
import ru.riveo.strollie.messenger.dto.ChatRenameRequest;
import ru.riveo.strollie.messenger.dto.ChatResponse;
import ru.riveo.strollie.messenger.exception.NotChatAuthorException;
import ru.riveo.strollie.messenger.service.ChatService;

import java.util.UUID;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<Page<ChatResponse>> getUserChats(
            @AuthenticationPrincipal Jwt jwt,
            Pageable pageable) {
        UUID userUUID = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(chatService.getUserChats(userUUID, pageable));
    }

    @PostMapping
    public ResponseEntity<ChatResponse> createChat(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody ChatCreateRequest chatCreateRequest) {
        UUID userUUID = UUID.fromString(jwt.getSubject());
        ChatResponse chat = chatService.createChat(userUUID, chatCreateRequest);
        return ResponseEntity.ok(chat);
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<Void> deleteChat(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID chatId) {
        UUID userUUID = UUID.fromString(jwt.getSubject());
        chatService.deleteChat(userUUID, chatId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{chatId}/rename")
    public ResponseEntity<ChatResponse> renameChat(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID chatId,
            @RequestBody ChatRenameRequest renameRequest) {
        UUID userUUID = UUID.fromString(jwt.getSubject());
        ChatResponse updatedChat = chatService.renameChat(userUUID, chatId, renameRequest.getName());
        return ResponseEntity.ok(updatedChat);
    }

    @ExceptionHandler(NotChatAuthorException.class)
    public ResponseEntity<String> handleNotChatAuthor(NotChatAuthorException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

}
