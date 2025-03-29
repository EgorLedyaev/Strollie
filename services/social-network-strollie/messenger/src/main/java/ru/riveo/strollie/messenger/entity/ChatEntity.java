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
@Table(name = "chat_t")
public class ChatEntity {

    @Id
    @Column(name = "chat_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "author_id", nullable = false)
    private UUID authorId;

    @Size(max = 50)
    @Column(name = "chat_name", length = 50)
    private String chatName;

    @Column(name = "last_activity_at", nullable = false)
    private Instant lastActivityAt;

}