package ru.riveo.strollie.messenger.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.riveo.strollie.messenger.entity.MessageEntity;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<MessageEntity, UUID> {

    List<MessageEntity> findByChatIdOrderByTimestampAsc(UUID chatId);

    List<MessageEntity> findByChatIdOrderByTimestampDesc(UUID chatId);

    Page<MessageEntity> findByChatIdOrderByTimestampDesc(UUID chatId, Pageable pageable);

}
