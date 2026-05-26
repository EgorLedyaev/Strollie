// src/main/java/ru/riveo/strollie/messenger/entity/MessageEntity.java
package ru.riveo.strollie.messenger.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "message_t")
public class MessageEntity {

    @Id
    @Column(name = "message_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "chat_id", nullable = false)
    private UUID chatId; // Foreign key to ChatEntity

    @NotNull
    @Column(name = "sender_id", nullable = false)
    private UUID senderId; // ID of the user who sent the message

    @Size(max = 2000)
    @NotNull
    @Column(name = "content", length = 2000, nullable = false)
    private String content;

    @NotNull
    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = Instant.now();
        }
    }
}