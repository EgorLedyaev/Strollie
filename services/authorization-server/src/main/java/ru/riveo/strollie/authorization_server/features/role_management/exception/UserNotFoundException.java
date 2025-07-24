package ru.riveo.strollie.authorization_server.features.role_management.exception;

import ru.riveo.strollie.authorization_server.shared.exception.ResourceNotFoundException;

/**
 * Исключение, выбрасываемое при попытке найти пользователя, который не
 * существует
 */
public class UserNotFoundException extends ResourceNotFoundException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
