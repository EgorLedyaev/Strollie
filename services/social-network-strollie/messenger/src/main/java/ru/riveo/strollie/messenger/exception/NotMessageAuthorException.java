package ru.riveo.strollie.messenger.exception;

import java.util.UUID;

public class NotMessageAuthorException extends RuntimeException {
    public NotMessageAuthorException(UUID userId, Integer messageId) {
        super("User with id " + userId + " is not the author of message " + messageId);
    }
}
