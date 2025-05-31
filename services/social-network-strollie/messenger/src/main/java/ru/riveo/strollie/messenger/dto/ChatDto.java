package ru.riveo.strollie.messenger.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ChatDto {
    private UUID id;
    private UUID authorId;
    private String chatName;
    private Instant lastActivityAt;
    private List<String> participantsNames;
}
