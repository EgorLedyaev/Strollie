package ru.riveo.strollie.client.client;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import ru.riveo.strollie.client.dto.ChatDto;
import ru.riveo.strollie.client.dto.CreateChatRequest;
import ru.riveo.strollie.client.dto.MessageDto;
import ru.riveo.strollie.client.dto.SendMessageRequest;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
public class RestClientMessenger {

    private static final ParameterizedTypeReference<List<ChatDto>> CHAT_LIST_TYPE =
            new ParameterizedTypeReference<>() {
            };

    private static final ParameterizedTypeReference<List<MessageDto>> MESSAGE_LIST_TYPE =
            new ParameterizedTypeReference<>() {
            };

    private final RestClient restClient;

    public List<ChatDto> getUserChats() {
        return this.restClient
                .get()
                .uri("/api/v1/messenger/chats")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(CHAT_LIST_TYPE);
    }

    public void createChat(CreateChatRequest request) {
        this.restClient
                .post()
                .uri("/api/v1/messenger/chats")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }

    public ChatDto getChatById(UUID id) {
        return this.restClient
                .get()
                .uri("/api/v1/messenger/chats/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(ChatDto.class);
    }

    public List<MessageDto> getMessagesByChatId(UUID chatId) {
        return this.restClient
                .get()
                .uri("/api/v1/messenger/chats/{id}/messages", chatId)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(MESSAGE_LIST_TYPE);
    }

    public void sendMessage(SendMessageRequest request) {
        this.restClient
                .post()
                .uri("/api/v1/messenger/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }

    public void addParticipant(UUID chatId, String username) {
        this.restClient
                .post()
                .uri("/api/v1/messenger/chats/{chatId}/participants?username={username}",
                        chatId, username)
                .retrieve()
                .toBodilessEntity();
    }

    public void removeParticipant(UUID chatId, String username) {
        this.restClient
                .delete()
                .uri("/api/v1/messenger/chats/{chatId}/participants?username={username}",
                        chatId, username)
                .retrieve()
                .toBodilessEntity();
    }

    public String getUsernameById(UUID userId) {
        return this.restClient
                .get()
                .uri("/api/v1/messenger/users/{userId}/username", userId)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(String.class);
    }

}
