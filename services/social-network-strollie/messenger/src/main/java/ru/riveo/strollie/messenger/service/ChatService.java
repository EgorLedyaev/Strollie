// src/main/java/ru/riveo/strollie/messenger/service/ChatService.java
package ru.riveo.strollie.messenger.service;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.riveo.strollie.messenger.dto.ChatDto;
import ru.riveo.strollie.messenger.dto.CreateChatRequest;
import ru.riveo.strollie.messenger.dto.MessageDto;
import ru.riveo.strollie.messenger.dto.SendMessageRequest;
import ru.riveo.strollie.messenger.entity.*;
import ru.riveo.strollie.messenger.repository.ChatRepository;
import ru.riveo.strollie.messenger.repository.MessageRepository;
import ru.riveo.strollie.messenger.repository.ParticipantsRepository;
import ru.riveo.strollie.messenger.repository.UserRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final ParticipantsRepository participantsRepository;
    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name:chat.exchange}")
    private String exchangeName;

    public String getUsernameById(UUID userId) {
        return userRepository.findById(userId)
                .map(UserEntity::getUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
    }

    @Transactional
    public ChatDto createChat(CreateChatRequest request, UUID creatorId) {
        ChatEntity chat = new ChatEntity();
        chat.setAuthorId(creatorId);
        chat.setChatName(request.getChatName());
        chat.setLastActivityAt(Instant.now());

        if (request.getParticipantUsernames().size() > 1 &&
                (request.getChatName() == null || request.getChatName().isBlank())) {
            throw new IllegalArgumentException("Chat name is required for group chats.");
        }

        ChatEntity savedChat = chatRepository.save(chat);

        List<UUID> participantIds = userRepository.findAllByUsernameIn(request.getParticipantUsernames())
                .stream()
                .map(UserEntity::getId)
                .collect(Collectors.toList());

        if (!participantIds.contains(creatorId)) {
            participantIds.add(creatorId);
        }

        List<ParticipantsEntity> participants = participantIds.stream()
                .map(userId -> {
                    ParticipantsEntity participant = new ParticipantsEntity();
                    participant.setId(new ParticipantsEntityId(savedChat.getId(), userId));
                    return participant;
                })
                .collect(Collectors.toList());

        participantsRepository.saveAll(participants);

        return mapToChatDto(savedChat, request.getParticipantUsernames());
    }

    public List<ChatDto> getUserChats(UUID userId) {
        List<ChatEntity> chats = chatRepository.findChatsByUserId(userId);
        return chats.stream()
                .map(chat -> {
                    List<UUID> participantIds = participantsRepository.findById_ChatId(chat.getId())
                            .stream()
                            .map(p -> p.getId().getUserId())
                            .collect(Collectors.toList());

                    List<String> participantUsernames = userRepository.findAllById(participantIds)
                            .stream()
                            .map(UserEntity::getUsername)
                            .collect(Collectors.toList());

                    return mapToChatDto(chat, participantUsernames);
                })
                .collect(Collectors.toList());
    }


    @Transactional
    public MessageDto sendMessage(UUID senderId, String senderUsername, SendMessageRequest request) {
        if (!isUserParticipant(request.getChatId(), senderId)) {
            throw new AccessDeniedException("User is not a participant of this chat.");
        }

        MessageEntity message = new MessageEntity();
        message.setChatId(request.getChatId());
        message.setSenderId(senderId);
        message.setContent(request.getContent());
        message.setTimestamp(Instant.now());
        MessageEntity savedMessage = messageRepository.save(message);

        chatRepository.findById(request.getChatId()).ifPresent(chat -> {
            chat.setLastActivityAt(savedMessage.getTimestamp());
            chatRepository.save(chat);
        });

        MessageDto messageDto = mapToMessageDto(savedMessage, senderUsername);

        String routingKey = "chat.message." + request.getChatId().toString();
        rabbitTemplate.convertAndSend(exchangeName, routingKey, messageDto);
        System.out.println("Sent message to RabbitMQ: " + routingKey + " Payload: " + messageDto);

        return messageDto;
    }

    public List<MessageDto> getAllMessagesForChat(UUID chatId, UUID userId) {
        if (!participantsRepository.existsById_ChatIdAndId_UserId(chatId, userId)) {
            throw new AccessDeniedException("User does not have access to this chat");
        }

        List<MessageEntity> messages = messageRepository.findByChatIdOrderByTimestampDesc(chatId);

        return messages.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    private MessageDto mapEntityToDto(MessageEntity entity) {
        return MessageDto.builder()
                .id(entity.getId())
                .chatId(entity.getChatId())
                .senderId(entity.getSenderId())
                .senderUsername(userRepository.findById(entity.getSenderId()).get().getUsername())
                .content(entity.getContent())
                .timestamp(entity.getTimestamp())
                .build();
    }

    public boolean isUserParticipant(UUID chatId, UUID userId) {
        return participantsRepository.existsById_ChatIdAndId_UserId(chatId, userId);
    }

    private ChatDto mapToChatDto(ChatEntity chatEntity, List<String> participantName) {
        return ChatDto.builder()
                .id(chatEntity.getId())
                .authorId(chatEntity.getAuthorId())
                .chatName(chatEntity.getChatName())
                .lastActivityAt(chatEntity.getLastActivityAt())
                .participantsNames(participantName)
                .build();
    }

    private MessageDto mapToMessageDto(MessageEntity messageEntity, String senderUsername) {
        return MessageDto.builder()
                .id(messageEntity.getId())
                .chatId(messageEntity.getChatId())
                .senderId(messageEntity.getSenderId())
                .senderUsername(senderUsername) // Placeholder or passed in
                .content(messageEntity.getContent())
                .timestamp(messageEntity.getTimestamp())
                .build();
    }

    public ChatDto getChatById(UUID chatId, UUID userUuid) {
        UserEntity user = userRepository.findById(userUuid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String username = user.getUsername();

        ChatEntity chatEntity = chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));

        List<String> participantUsernames = participantsRepository.findById_ChatId(chatId)
                .stream()
                .map(p -> userRepository.findById(p.getId().getUserId()).get().getUsername())  // Предполагаем, что участник связан с UserEntity
                .collect(Collectors.toList());

        return mapToChatDto(chatEntity, participantUsernames);
    }

    @Transactional
    public ChatDto addParticipant(UUID chatId, String username, UUID requesterId) {
        ChatEntity chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));

        if (!isUserParticipant(chatId, requesterId)) {
            throw new AccessDeniedException("User is not a participant of this chat");
        }

        UserEntity userToAdd = userRepository.findByUsername((username))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (isUserParticipant(chatId, userToAdd.getId())) {
            throw new IllegalArgumentException("User is already a participant");
        }

        ParticipantsEntity participant = new ParticipantsEntity();
        participant.setId(new ParticipantsEntityId(chatId, userToAdd.getId()));
        participantsRepository.save(participant);

        chat.setLastActivityAt(Instant.now());
        chatRepository.save(chat);

        return getChatById(chatId, requesterId);
    }

    @Transactional
    public ChatDto removeParticipant(UUID chatId, String username, UUID requesterId) {
        ChatEntity chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));

        if (!chat.getAuthorId().equals(requesterId)) {
            throw new AccessDeniedException("Only chat owner can remove participants");
        }

        UserEntity userToRemove = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (userToRemove.getId().equals(requesterId)) {
            throw new IllegalArgumentException("Chat owner cannot remove themselves");
        }

        ParticipantsEntityId participantId = new ParticipantsEntityId(chatId, userToRemove.getId());
        if (!participantsRepository.existsById(participantId)) {
            throw new IllegalArgumentException("User is not a participant of this chat");
        }

        participantsRepository.deleteById(participantId);

        chat.setLastActivityAt(Instant.now());
        chatRepository.save(chat);

        return getChatById(chatId, requesterId);
    }

}