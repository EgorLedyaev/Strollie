package ru.riveo.strollie.messenger.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.riveo.strollie.messenger.dto.ChatDto;
import ru.riveo.strollie.messenger.dto.CreateChatRequest;
import ru.riveo.strollie.messenger.dto.MessageDto;
import ru.riveo.strollie.messenger.dto.SendMessageRequest;
import ru.riveo.strollie.messenger.service.ChatService;
import ru.riveo.strollie.messenger.util.PrincipalUtil;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/messenger")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/users/{userId}/username")
    public ResponseEntity<String> getUsernameById(@PathVariable UUID userId) {
        try {
            String username = chatService.getUsernameById(userId);
            return ResponseEntity.ok(username);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/chats")
    public ResponseEntity<ChatDto> createChat(@Valid @RequestBody CreateChatRequest request, Authentication authentication) {
        UUID creatorId = PrincipalUtil.getUserId(authentication);
        ChatDto chatDto = chatService.createChat(request, creatorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(chatDto);
    }

    @GetMapping("/chats/{chatId}")
    public ResponseEntity<ChatDto> getChatById(@PathVariable UUID chatId, Authentication authentication) {
        UUID userId = PrincipalUtil.getUserId(authentication);
        ChatDto chatDto = chatService.getChatById(chatId, userId);
        return ResponseEntity.ok(chatDto);
    }

    @GetMapping("/chats")
    public ResponseEntity<List<ChatDto>> getUserChats(Authentication authentication) {
        UUID userId = PrincipalUtil.getUserId(authentication);
        List<ChatDto> chats = chatService.getUserChats(userId);
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/chats/{chatId}/messages")
    public ResponseEntity<List<MessageDto>> getChatMessages(
            @PathVariable UUID chatId,
            Authentication authentication) {
        UUID userId = PrincipalUtil.getUserId(authentication);
        List<MessageDto> messages = chatService.getAllMessagesForChat(chatId, userId);
        return ResponseEntity.ok(messages);
    }


    @PostMapping("/messages")
    public ResponseEntity<MessageDto> sendHttpMessage(@Valid @RequestBody SendMessageRequest request, Authentication authentication) {
        UUID senderId = PrincipalUtil.getUserId(authentication);
        String senderUsername = PrincipalUtil.getUsername(authentication); // Get username for DTO
        MessageDto messageDto = chatService.sendMessage(senderId, senderUsername, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(messageDto);
    }

    @PostMapping("/chats/{chatId}/participants")
    public ResponseEntity<?> addParticipant(
            @PathVariable UUID chatId,
            @RequestParam String username,
            Authentication authentication) {
        try {
            UUID requesterId = PrincipalUtil.getUserId(authentication);
            ChatDto chatDto = chatService.addParticipant(chatId, username, requesterId);
            return ResponseEntity.ok(chatDto);
        } catch (IllegalArgumentException e) {
            String message = e.getMessage() != null && !e.getMessage().isEmpty() ? e.getMessage() : "Неверные параметры запроса.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        } catch (AccessDeniedException e) {
            String message = e.getMessage() != null && !e.getMessage().isEmpty() ? e.getMessage() : "Доступ запрещен.";
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message);
        } catch (Exception e) {
            log.error("Error adding participant: chatId={}, username={}", chatId, username, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Внутренняя ошибка сервера при добавлении участника.");
        }
    }

    @DeleteMapping("/chats/{chatId}/participants")
    public ResponseEntity<?> removeParticipant(
            @PathVariable UUID chatId,
            @RequestParam String username,
            Authentication authentication) {
        try {
            UUID requesterId = PrincipalUtil.getUserId(authentication);
            ChatDto chatDto = chatService.removeParticipant(chatId, username, requesterId);
            return ResponseEntity.ok(chatDto);
        } catch (IllegalArgumentException e) {
            String message = e.getMessage() != null && !e.getMessage().isEmpty() ? e.getMessage() : "Неверные параметры запроса.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        } catch (AccessDeniedException e) {
            String message = e.getMessage() != null && !e.getMessage().isEmpty() ? e.getMessage() : "Доступ запрещен.";
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message);
        } catch (Exception e) {
            log.error("Error removing participant: chatId={}, username={}", chatId, username, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Внутренняя ошибка сервера при удалении участника.");
        }
    }
}