package ru.riveo.messenger_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;
import ru.riveo.messenger_service.api.ChatApi;
import ru.riveo.messenger_service.api.request.CreateChatRequest;
import ru.riveo.messenger_service.api.response.MessageResponse;

import java.util.List;
import java.util.UUID;

@RestController
public class ChatController implements ChatApi {
    @Override
    public ResponseEntity<Void> createChat(CreateChatRequest request, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<Void> deleteChat(UUID chatId, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<Void> addUserToChat(UUID chatId, UUID userId, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<Void> removeUserFromChat(UUID chatId, UUID userId, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<List<MessageResponse>> getChatMessages(UUID chatId, int page, int size) {
        return null;
    }
}
