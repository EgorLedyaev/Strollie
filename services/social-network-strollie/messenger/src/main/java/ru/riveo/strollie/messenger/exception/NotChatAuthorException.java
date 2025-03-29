package ru.riveo.strollie.messenger.exception;

import java.util.UUID;

public class NotChatAuthorException extends RuntimeException {
    public NotChatAuthorException(UUID userId, UUID chatId) {
        super("User with id " + userId + " is not the author of chat " + chatId);
    }
}