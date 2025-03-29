package ru.riveo.strollie.messenger.repository;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.riveo.strollie.messenger.entity.ChatEntity;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<ChatEntity, UUID> {

    List<ChatEntity> findByAuthorId(@NotNull UUID authorId);

    @Query("SELECT c FROM ChatEntity c WHERE c.id IN (SELECT p.id.chatId FROM ParticipantsEntity p WHERE p.id.userId = :userId) ORDER BY c.lastActivityAt ASC")
    Page<ChatEntity> findChatsByUserIdOrderByActivity(@Param("userId") UUID userId, Pageable pageable);

    @Modifying
    @Query("UPDATE ChatEntity c SET c.lastActivityAt = :time WHERE c.id = :chatId")
    void updateLastActivity(@Param("chatId") UUID chatId, @Param("time") Instant time);

}
