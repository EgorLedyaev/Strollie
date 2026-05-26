package ru.riveo.strollie.messenger.exception;

public class MessageNotFoundException extends RuntimeException {
    public MessageNotFoundException(Integer messageId) {
        super("Message with id " + messageId + " not found");
    }
}
