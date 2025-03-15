package ru.riveo.strollie.messenger.repository;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.riveo.strollie.messenger.entity.ChatEntity;

import java.util.List;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<ChatEntity, UUID> {

    List<ChatEntity> findByAuthorId(@NotNull UUID authorId);

}
