package ru.riveo.strollie.authorization_server.features.user_registration.exception;

import ru.riveo.strollie.authorization_server.shared.exception.ResourceAlreadyExistsException;

/**
 * Исключение, выбрасываемое при попытке создать пользователя, который уже
 * существует
 */
public class UserAlreadyExistsException extends ResourceAlreadyExistsException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
