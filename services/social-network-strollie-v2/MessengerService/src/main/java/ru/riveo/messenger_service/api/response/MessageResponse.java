package ru.riveo.messenger_service.api.response;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class MessageResponse {

    private UUID chatId;
    private String message;
    private UUID senderUUID;
    private String senderName;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant deletedAt;

}
