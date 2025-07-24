package ru.riveo.strollie.authorization_server.shared.exception;

/**
 * Исключение, выбрасываемое при превышении лимитов запросов
 */
public class RateLimitExceededException extends BusinessException {
    public RateLimitExceededException(String message) {
        super(message);
    }
}
