package ru.riveo.strollie.messenger.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.riveo.strollie.messenger.dto.MessageDto;
import ru.riveo.strollie.messenger.entity.MessageEntity;
import ru.riveo.strollie.messenger.exception.MessageNotFoundException;
import ru.riveo.strollie.messenger.exception.NotChatParticipantException;
import ru.riveo.strollie.messenger.exception.NotMessageAuthorException;
import ru.riveo.strollie.messenger.repository.MessageRepository;
import ru.riveo.strollie.messenger.repository.ParticipantRepository;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ParticipantRepository participantRepository;

    public Page<MessageDto> getMessages(UUID userId, UUID chatId, Pageable pageable) {
        if (!participantRepository.existsById_ChatIdAndId_UserId(chatId, userId)) {
            throw new NotChatParticipantException(userId, chatId);
        }

        return messageRepository.findByChatIdAndDeletedAtIsNull(chatId, pageable)
                .map(this::mapToDto);
    }

    public MessageDto sendMessage(UUID userId, UUID chatId, String text) {
        if (!participantRepository.existsById_ChatIdAndId_UserId(chatId, userId)) {
            throw new NotChatParticipantException(userId, chatId);
        }

        MessageEntity message = new MessageEntity();
        message.setUserId(userId);
        message.setChatId(chatId);
        message.setText(text);
        message.setCreatedAt(Instant.now());

        return mapToDto(messageRepository.save(message));
    }

    public MessageDto editMessage(UUID userId, Integer messageId, String newText) {
        MessageEntity message = messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageNotFoundException(messageId));

        if (!message.getUserId().equals(userId)) {
            throw new NotMessageAuthorException(userId, messageId);
        }

        message.setText(newText);
        message.setEditAt(Instant.now());

        return mapToDto(messageRepository.save(message));
    }

    public void deleteMessage(UUID userId, Integer messageId) {
        MessageEntity message = messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageNotFoundException(messageId));

        if (!message.getUserId().equals(userId)) {
            throw new NotMessageAuthorException(userId, messageId);
        }

        message.setDeletedAt(Instant.now());
        messageRepository.save(message);
    }

    private MessageDto mapToDto(MessageEntity messageEntity) {
        return MessageDto.builder()
                .id(messageEntity.getId())
                .userId(messageEntity.getUserId())
                .chatId(messageEntity.getChatId())
                .text(messageEntity.getText())
                .createdAt(messageEntity.getCreatedAt())
                .editAt(messageEntity.getEditAt())
                .build();
    }

}
