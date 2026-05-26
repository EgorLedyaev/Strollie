package ru.riveo.messenger_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;
import ru.riveo.messenger_service.api.MessageApi;
import ru.riveo.messenger_service.api.request.MessageRequest;

import java.util.UUID;

@RestController
public class MessageController implements MessageApi {


    @Override
    public ResponseEntity<Void> sendMessage(UUID chatId, MessageRequest request, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<Void> deleteMessage(UUID chatId, UUID messageId, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<Void> editMessage(UUID chatId, UUID messageId, MessageRequest request, Authentication authentication) {
        return null;
    }
}
