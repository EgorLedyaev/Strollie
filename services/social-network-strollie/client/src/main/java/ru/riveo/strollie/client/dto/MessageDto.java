package ru.riveo.strollie.client.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private UUID id;
    private UUID chatId;
    private UUID senderId;
    private String senderUsername;
    private String content;
    private Instant timestamp;
}
