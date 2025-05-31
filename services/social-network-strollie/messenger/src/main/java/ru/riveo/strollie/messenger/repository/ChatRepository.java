package ru.riveo.strollie.messenger.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.riveo.strollie.messenger.entity.ChatEntity;

import java.util.List;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<ChatEntity, UUID> {

    @Query("SELECT c FROM ChatEntity c JOIN ParticipantsEntity p ON c.id = p.id.chatId WHERE p.id.userId = :userId ORDER BY c.lastActivityAt DESC")
    List<ChatEntity> findChatsByUserId(@Param("userId") UUID userId);

}
