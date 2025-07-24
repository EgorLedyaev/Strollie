package ru.riveo.strollie.authorization_server.infrastructure.persistence.features.passwordless_auth.login_with_otp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.port.UserAccount;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.port.UserAccountFinder;
import ru.riveo.strollie.authorization_server.infrastructure.persistence.jpa.JpaUserRepository;

import java.util.Optional;

/**
 * Адаптер, который реализует UserAccountFinder, используя
 * JpaUserRepository для доступа к данным в БД.
 * Преобразует доменную модель User в DTO UserAccount.
 */
@Component
@RequiredArgsConstructor
public class UserAccountFinderAdapter implements UserAccountFinder {

    private final JpaUserRepository jpaUserRepository;

    @Override
    public Optional<UserAccount> findByEmail(String email) {
        return jpaUserRepository.findByEmail(email)
                .map(user -> new UserAccount(
                        user.getEmail(),
                        user.getRoles(),
                        user.isEnabled(),
                        user.isAccountNonLocked()
                ));
    }
}