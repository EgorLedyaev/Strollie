package ru.riveo.strollie.messenger.exception;

import java.util.UUID;

public class ChatNotFoundException extends RuntimeException {
    public ChatNotFoundException(UUID chatId) {
        super("Chat with id " + chatId + " not found");
    }
}