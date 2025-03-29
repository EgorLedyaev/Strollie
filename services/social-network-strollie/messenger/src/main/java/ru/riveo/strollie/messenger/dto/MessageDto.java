package ru.riveo.strollie.messenger.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class MessageDto {
    private Integer id;
    private UUID userId;
    private UUID chatId;
    private String text;
    private Instant createdAt;
    private Instant editAt;
}
