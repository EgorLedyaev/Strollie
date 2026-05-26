package ru.riveo.strollie.authorization_server.infrastructure.persistence.features.passwordless_auth.request_otp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.port.UserExistenceChecker;
import ru.riveo.strollie.authorization_server.infrastructure.persistence.jpa.JpaUserRepository;

@Component
@RequiredArgsConstructor
public class UserExistenceCheckerAdapter implements UserExistenceChecker {

    private final JpaUserRepository jpaUserRepository;

    @Override
    public boolean existsByEmail(String email) {
        return jpaUserRepository.existsByEmail(email);
    }
}