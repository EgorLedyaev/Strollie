package ru.riveo.messenger_service.api.wsentity;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class MessageWs {

    private UUID chatId;
    private String message;
    private UUID senderUUID;
    private String senderName;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant deletedAt;

}
