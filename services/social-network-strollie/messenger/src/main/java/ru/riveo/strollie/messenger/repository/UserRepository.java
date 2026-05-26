package ru.riveo.strollie.messenger.repository;

import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.riveo.strollie.messenger.entity.UserEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    List<UserEntity> findAllByUsernameIn(List<String> usernames);

    Optional<UserEntity> findByUsername(String username);
}
