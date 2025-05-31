package ru.riveo.strollie.messenger.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class MessageDto {
    private UUID id;
    private UUID chatId;
    private UUID senderId;
    private String senderUsername;
    private String content;
    private Instant timestamp;
}