package ru.riveo.strollie.authorization_server.infrastructure.persistence.features.user_registration;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.riveo.strollie.authorization_server.features.user_registration.RegistrantMapper;
import ru.riveo.strollie.authorization_server.features.user_registration.domain.Registrant;
import ru.riveo.strollie.authorization_server.features.user_registration.port.RegistrantRepository;
import ru.riveo.strollie.authorization_server.infrastructure.persistence.jpa.JpaUserRepository;
import ru.riveo.strollie.authorization_server.infrastructure.persistence.jpa.UserEntity;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class RegistrantRepositoryAdapter implements RegistrantRepository {

    private final JpaUserRepository jpaUserRepository;
    private final RegistrantMapper registrantMapper;

    @Override
    public boolean existsByEmailOrNickname(String email, String nickname) {
        return jpaUserRepository.existsByEmail(email) || jpaUserRepository.existsByNickname(nickname);
    }

    @Override
    @Transactional
    public void save(Registrant registrant) {
        // Адаптер просто вызывает маппер и репозиторий.
        // Он НЕ содержит бизнес-логику `User.register`.
        UserEntity newUserEntity = registrantMapper.toEntity(registrant);

        // Устанавливаем значения по умолчанию здесь, на уровне персистенции
        newUserEntity.setRoles(Set.of("ROLE_USER"));
        newUserEntity.setEnabled(true);
        newUserEntity.setAccountNonExpired(true);
        newUserEntity.setAccountNonLocked(true);
        newUserEntity.setCredentialsNonExpired(true);

        jpaUserRepository.save(newUserEntity);
    }
}