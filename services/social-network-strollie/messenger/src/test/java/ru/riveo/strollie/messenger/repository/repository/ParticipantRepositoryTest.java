package ru.riveo.strollie.messenger.repository.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import ru.riveo.strollie.messenger.entity.ParticipantsEntity;
import ru.riveo.strollie.messenger.entity.ParticipantsEntityId;
import ru.riveo.strollie.messenger.repository.ParticipantRepository;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class ParticipantRepositoryTest {

    @Autowired
    private ParticipantRepository participantRepository;

    @Test
    public void testFindById_ChatIdAndId_UserId() {
        // Given
        UUID chatId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        ParticipantsEntityId id = new ParticipantsEntityId();
        id.setChatId(chatId);
        id.setUserId(userId);

        ParticipantsEntity participant = new ParticipantsEntity();
        participant.setId(id);
        participantRepository.save(participant);

        // When
        Optional<ParticipantsEntity> foundParticipant = participantRepository.findById_ChatIdAndId_UserId(chatId, userId);

        // Then
        assertThat(foundParticipant).isPresent();
        assertThat(foundParticipant.get().getId().getChatId()).isEqualTo(chatId);
        assertThat(foundParticipant.get().getId().getUserId()).isEqualTo(userId);
    }

    @Test
    public void testFindById_ChatIdAndId_UserId_NotFound() {
        // Given
        UUID chatId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        // When
        Optional<ParticipantsEntity> foundParticipant = participantRepository.findById_ChatIdAndId_UserId(chatId, userId);

        // Then
        assertThat(foundParticipant).isEmpty();
    }

    @Test
    public void testDeleteParticipant() {
        // Given
        UUID chatId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        ParticipantsEntityId id = new ParticipantsEntityId();
        id.setChatId(chatId);
        id.setUserId(userId);

        ParticipantsEntity participant = new ParticipantsEntity();
        participant.setId(id);
        participantRepository.save(participant);

        // When
        participantRepository.delete(participant);

        // Then
        Optional<ParticipantsEntity> deletedParticipant = participantRepository.findById_ChatIdAndId_UserId(chatId, userId);
        assertThat(deletedParticipant).isEmpty();
    }
}