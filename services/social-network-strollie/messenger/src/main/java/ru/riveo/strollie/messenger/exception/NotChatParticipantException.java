package ru.riveo.strollie.messenger.exception;

import java.util.UUID;

public class NotChatParticipantException extends RuntimeException {
    public NotChatParticipantException(UUID userId, UUID chatId) {
        super("User with id " + userId + " is not a participant of chat " + chatId);
    }
}
