package ru.riveo.strollie.authorization_server.shared.exception;

/**
 * Базовое бизнес-исключение для всех доменных ошибок
 */
public abstract class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
