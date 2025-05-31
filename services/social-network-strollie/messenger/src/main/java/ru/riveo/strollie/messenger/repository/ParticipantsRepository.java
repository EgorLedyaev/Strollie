package ru.riveo.strollie.messenger.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.riveo.strollie.messenger.entity.ParticipantsEntity;
import ru.riveo.strollie.messenger.entity.ParticipantsEntityId;

import java.util.List;
import java.util.UUID;

public interface ParticipantsRepository extends JpaRepository<ParticipantsEntity, ParticipantsEntityId> {

    boolean existsById_ChatIdAndId_UserId(UUID chatId, UUID userId);

    List<ParticipantsEntity> findById_ChatId(UUID chatId);


    List<ParticipantsEntity> findById_UserId(UUID userId);
}