package ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.port;

import java.util.Optional;

/**
 * Порт, определяющий, как фича "login_with_otp" получает
 * информацию о пользователе.
 */
public interface UserAccountFinder {

    /**
     * Находит аккаунт пользователя по email.
     * @param email Email для поиска.
     * @return Optional, содержащий UserAccount, если пользователь найден.
     */
    Optional<UserAccount> findByEmail(String email);
}