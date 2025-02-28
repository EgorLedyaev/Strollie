package ru.riveo.messenger_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import ru.riveo.messenger_service.api.WebSocketApi;
import ru.riveo.messenger_service.api.wsentity.MessageWs;

import java.util.UUID;

@Controller
public class WebSocketController implements WebSocketApi {
    @Override
    public ResponseEntity<Void> connect() {
        return null;
    }

    @Override
    public ResponseEntity<Void> subscribeToChat(UUID chatId) {
        return null;
    }

    @Override
    public ResponseEntity<Void> sendMessage(UUID chatId, MessageWs request) {
        return null;
    }
}
