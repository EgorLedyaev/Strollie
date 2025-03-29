package ru.riveo.strollie.messenger.repository.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import ru.riveo.strollie.messenger.entity.MessageEntity;
import ru.riveo.strollie.messenger.repository.MessageRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class MessageRepositoryTest {

    @Autowired
    private MessageRepository messageRepository;

    @Test
    public void testFindByChatId() {
        // Given
        UUID chatId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        MessageEntity message1 = new MessageEntity();
        message1.setUserId(userId);
        message1.setChatId(chatId);
        message1.setText("Hello, World!");
        message1.setCreatedAt(Instant.now());

        MessageEntity message2 = new MessageEntity();
        message2.setUserId(userId);
        message2.setChatId(chatId);
        message2.setText("How are you?");
        message2.setCreatedAt(Instant.now());

        MessageEntity message3 = new MessageEntity();
        message3.setUserId(userId);
        message3.setChatId(UUID.randomUUID()); // Different chat
        message3.setText("This is another chat.");
        message3.setCreatedAt(Instant.now());

        messageRepository.save(message1);
        messageRepository.save(message2);
        messageRepository.save(message3);

        // When
        List<MessageEntity> messages = messageRepository.findByChatId(chatId);

        // Then
        assertThat(messages).hasSize(2);
        assertThat(messages).extracting(MessageEntity::getText).containsExactlyInAnyOrder("Hello, World!", "How are you?");
    }

    @Test
    public void testFindByChatId_NoResults() {
        // Given
        UUID chatId = UUID.randomUUID();

        // When
        List<MessageEntity> messages = messageRepository.findByChatId(chatId);

        // Then
        assertThat(messages).isEmpty();
    }

    @Test
    public void testDeleteMessage() {
        // Given
        UUID chatId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        MessageEntity message = new MessageEntity();
        message.setUserId(userId);
        message.setChatId(chatId);
        message.setText("Test Message");
        message.setCreatedAt(Instant.now());
        messageRepository.save(message);

        // When
        messageRepository.delete(message);

        // Then
        Optional<MessageEntity> deletedMessage = messageRepository.findById(message.getId());
        assertThat(deletedMessage).isEmpty();
    }

}