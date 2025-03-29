package ru.riveo.strollie.messenger.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.riveo.strollie.messenger.dto.ChatCreateRequest;
import ru.riveo.strollie.messenger.dto.ChatResponse;
import ru.riveo.strollie.messenger.entity.ChatEntity;
import ru.riveo.strollie.messenger.entity.ParticipantsEntity;
import ru.riveo.strollie.messenger.entity.ParticipantsEntityId;
import ru.riveo.strollie.messenger.exception.ChatNotFoundException;
import ru.riveo.strollie.messenger.exception.NotChatAuthorException;
import ru.riveo.strollie.messenger.repository.ChatRepository;
import ru.riveo.strollie.messenger.repository.ParticipantRepository;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ParticipantRepository participantRepository;

    @Transactional
    public ChatResponse createChat(UUID userUUID, ChatCreateRequest chatCreateRequest) {
        ChatEntity chat = new ChatEntity();
        chat.setAuthorId(userUUID);
        chat.setChatName(chatCreateRequest.getChatName());
        chat.setLastActivityAt(Instant.now());
        chat = chatRepository.save(chat);

        ParticipantsEntity participantsEntity = new ParticipantsEntity();
        participantsEntity.setId(new ParticipantsEntityId(chat.getId(), userUUID));
        participantRepository.save(participantsEntity);

        return ChatResponse.builder()
                .chatId(chat.getId())
                .authorId(userUUID)
                .chatName(chat.getChatName())
                .build();
    }

    public void deleteChat(UUID userId, UUID chatId) {
        chatRepository.findById(chatId).ifPresent(chat -> {
            if (!chat.getAuthorId().equals(userId)) {
                throw new NotChatAuthorException(userId, chatId);
            }
            chatRepository.delete(chat);
        });
    }

    public Page<ChatResponse> getUserChats(UUID userId, Pageable pageable) {
        return chatRepository.findChatsByUserIdOrderByActivity(userId, pageable)
                .map(this::mapToResponse);
    }

    private ChatResponse mapToResponse(ChatEntity chatEntity) {
        return ChatResponse.builder()
                .chatId(chatEntity.getId())
                .authorId(chatEntity.getAuthorId())
                .chatName(chatEntity.getChatName())
                .lastActivityAt(chatEntity.getLastActivityAt())
                .build();
    }

    public ChatResponse renameChat(UUID userId, UUID chatId, String newName) {
        ChatEntity chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatNotFoundException(chatId));

        if (!chat.getAuthorId().equals(userId)) {
            throw new NotChatAuthorException(userId, chatId);
        }

        chat.setChatName(newName);
        chat = chatRepository.save(chat);

        return mapToResponse(chat);
    }

    @Transactional
    public void joinChat(UUID userId, UUID chatId) {
        if (!chatRepository.existsById(chatId)) {
            throw new ChatNotFoundException(chatId);
        }

        if (participantRepository.existsById(new ParticipantsEntityId(chatId, userId))) {
            return;
        }

        ParticipantsEntity participant = new ParticipantsEntity();
        participant.setId(new ParticipantsEntityId(chatId, userId));
        participantRepository.save(participant);

        chatRepository.updateLastActivity(chatId, Instant.now());
    }

}
