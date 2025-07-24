package ru.riveo.strollie.authorization_server.shared.exception;

/**
 * Исключение, выбрасываемое когда объект с указанным идентификатором не найден
 */
public class ResourceNotFoundException extends BusinessException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
