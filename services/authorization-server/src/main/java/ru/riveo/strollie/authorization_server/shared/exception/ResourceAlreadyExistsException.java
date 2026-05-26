package ru.riveo.strollie.authorization_server.shared.exception;

/**
 * Исключение, выбрасываемое при попытке создать ресурс, который уже существует
 */
public class ResourceAlreadyExistsException extends BusinessException {
    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
}
