package ru.riveo.strollie.messenger.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class ChatResponse {
    private UUID chatId;
    private String chatName;
    private UUID authorId;
    private Instant lastActivityAt;
}
