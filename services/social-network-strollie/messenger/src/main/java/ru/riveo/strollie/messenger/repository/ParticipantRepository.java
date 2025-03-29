package ru.riveo.strollie.messenger.repository;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.riveo.strollie.messenger.entity.ParticipantsEntity;
import ru.riveo.strollie.messenger.entity.ParticipantsEntityId;

import java.util.Optional;
import java.util.UUID;

public interface ParticipantRepository extends JpaRepository<ParticipantsEntity, ParticipantsEntityId> {

    Optional<ParticipantsEntity> findById_ChatIdAndId_UserId(@NotNull UUID idChatId, @NotNull UUID idUserId);

    boolean existsById_ChatIdAndId_UserId(UUID chatId, UUID userId);

}
