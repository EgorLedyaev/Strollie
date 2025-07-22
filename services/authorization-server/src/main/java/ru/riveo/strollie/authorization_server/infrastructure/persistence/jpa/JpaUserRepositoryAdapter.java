package ru.riveo.strollie.authorization_server.infrastructure.persistence.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import ru.riveo.strollie.authorization_server.shared.domain.User;
import ru.riveo.strollie.authorization_server.shared.repository.UserRepository;

@Repository
@RequiredArgsConstructor
public class JpaUserRepositoryAdapter implements UserRepository {

    private final JpaUserRepository jpaUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaUserRepository.findByEmail(email)
                .map(this::mapToUser);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaUserRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByNickname(String nickname) {
        return jpaUserRepository.existsByNickname(nickname);
    }

    @Override
    public User save(User user) {
        UserEntity entity;
        if (user.id() == null) {
            // Создание нового пользователя
            entity = new UserEntity();
        } else {
            // Обновление существующего пользователя
            entity = jpaUserRepository.findById(user.id())
                    .orElseThrow(() -> new IllegalStateException("User not found for update with id: " + user.id()));
        }

        // Маппинг данных из доменной модели в сущность
        entity.setEmail(user.email());
        entity.setNickname(user.nickname());
        entity.setFirstName(user.firstName());
        entity.setLastName(user.lastName());
        entity.setCity(user.city());
        entity.setDateOfBirth(user.dateOfBirth());
        entity.setRoles(user.roles());
        entity.setEnabled(user.enabled());
        entity.setAccountNonExpired(user.accountNonExpired());
        entity.setAccountNonLocked(user.accountNonLocked());
        entity.setCredentialsNonExpired(user.credentialsNonExpired());

        // Пароль нам не нужен, но если поле в БД есть, пусть будет заглушка
        if (entity.getPassword() == null || entity.getPassword().isEmpty()) {
            entity.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        }

        UserEntity savedEntity = jpaUserRepository.save(entity);
        return mapToUser(savedEntity);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return jpaUserRepository.findById(id)
                .map(this::mapToUser);
    }

    private User mapToUser(UserEntity entity) {
        return new User(
                entity.getId(),
                entity.getEmail(),
                entity.getNickname(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getCity(),
                entity.getDateOfBirth(),
                entity.getRoles(),
                entity.isEnabled(),
                entity.isAccountNonExpired(),
                entity.isAccountNonLocked(),
                entity.isCredentialsNonExpired());
    }
}
