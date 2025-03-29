package ru.riveo.strollie.messenger.repository.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import ru.riveo.strollie.messenger.entity.ChatEntity;
import ru.riveo.strollie.messenger.repository.ChatRepository;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class ChatRepositoryTest {

    @Autowired
    private ChatRepository chatRepository;

    @Test
    public void testFindByAuthorId() {
        //Given
        UUID authorId = UUID.randomUUID();
        ChatEntity chat1 = new ChatEntity();
        chat1.setAuthorId(authorId);
        chat1.setChatName("Chat 1");

        ChatEntity chat2 = new ChatEntity();
        chat2.setAuthorId(authorId);
        chat2.setChatName("Chat 2");

        ChatEntity chat3 = new ChatEntity();
        chat3.setAuthorId(UUID.randomUUID());
        chat3.setChatName("Chat 3");

        chatRepository.save(chat1);
        chatRepository.save(chat2);
        chatRepository.save(chat3);

        //When
        List<ChatEntity> chats = chatRepository.findByAuthorId(authorId);

        //Then
        assertThat(chats).hasSize(2);
        assertThat(chats).extracting(ChatEntity::getChatName).containsExactlyInAnyOrder("Chat 1", "Chat 2");
    }

    @Test
    public void testFindByAuthorId_NoResults() {
        // Given
        UUID authorId = UUID.randomUUID();

        // When
        List<ChatEntity> chats = chatRepository.findByAuthorId(authorId);

        // Then
        assertThat(chats).isEmpty(); // No chats for this author
    }

    @Test
    public void testDeleteChat() {
        // Given
        UUID authorId = UUID.randomUUID();
        ChatEntity chat = new ChatEntity();
        chat.setAuthorId(authorId);
        chat.setChatName("Test Chat");
        chatRepository.save(chat);

        // When
        chatRepository.delete(chat);

        // Then
        assertThat(chatRepository.findById(chat.getId())).isEmpty(); // Chat should no longer exist
    }

}
