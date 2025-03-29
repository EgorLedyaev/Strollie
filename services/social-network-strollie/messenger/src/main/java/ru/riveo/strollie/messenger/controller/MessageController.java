package ru.riveo.strollie.messenger.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import ru.riveo.strollie.messenger.dto.MessageDto;
import ru.riveo.strollie.messenger.exception.MessageNotFoundException;
import ru.riveo.strollie.messenger.exception.NotChatAuthorException;
import ru.riveo.strollie.messenger.exception.NotChatParticipantException;
import ru.riveo.strollie.messenger.exception.NotMessageAuthorException;
import ru.riveo.strollie.messenger.service.MessageService;

import java.util.UUID;

@RestController
@RequestMapping("/api/chats/{chatId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<Page<MessageDto>> getMessages(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID chatId,
            Pageable pageable) {
        UUID userUUID = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(messageService.getMessages(userUUID, chatId, pageable));
    }

    @PostMapping
    public ResponseEntity<MessageDto> sendMessage(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID chatId,
            @RequestBody String text) {
        UUID userUUID = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(messageService.sendMessage(userUUID, chatId, text));
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<MessageDto> editMessage(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID chatId,
            @PathVariable Integer messageId,
            @RequestBody String newText) {
        UUID userUUID = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(messageService.editMessage(userUUID, messageId, newText));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID chatId,
            @PathVariable Integer messageId) {
        UUID userUUID = UUID.fromString(jwt.getSubject());
        messageService.deleteMessage(userUUID, messageId);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(NotChatAuthorException.class)
    public ResponseEntity<String> handleNotChatAuthor(NotChatAuthorException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(MessageNotFoundException.class)
    public ResponseEntity<String> handleMessageNotFound(MessageNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(NotMessageAuthorException.class)
    public ResponseEntity<String> handleNotMessageAuthor(NotMessageAuthorException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(NotChatParticipantException.class)
    public ResponseEntity<String> handleNotChatParticipant(NotChatParticipantException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }


}
