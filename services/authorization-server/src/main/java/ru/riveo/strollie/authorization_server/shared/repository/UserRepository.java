package ru.riveo.strollie.authorization_server.shared.repository;

import java.util.Optional;
import java.util.UUID;

import ru.riveo.strollie.authorization_server.shared.domain.User;

public interface UserRepository {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    User save(User user);

    Optional<User> findById(UUID id);
}
