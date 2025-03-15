package ru.riveo.strollie.personalcabinet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.riveo.strollie.personalcabinet.entity.UserEntity;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    Optional<UserEntity> findUserEntitiesById(UUID userId);

}