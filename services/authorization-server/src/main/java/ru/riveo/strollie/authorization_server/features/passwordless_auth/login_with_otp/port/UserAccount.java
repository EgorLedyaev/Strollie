package ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.port;

import java.util.Set;

/**
 * Простая, независимая от фреймворка модель данных, представляющая
 * аккаунт пользователя для нужд аутентификации.
 * Содержит только необходимую информацию.
 */
public record UserAccount(
        String email,
        Set<String> roles,
        boolean isEnabled,
        boolean isAccountNonLocked
) {
}