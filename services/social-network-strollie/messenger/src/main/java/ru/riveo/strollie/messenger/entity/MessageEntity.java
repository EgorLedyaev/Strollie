package ru.riveo.strollie.messenger.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "messages_t")
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "messages_t_id_gen")
    @SequenceGenerator(name = "messages_t_id_gen", sequenceName = "messages_t_message_id_seq", allocationSize = 1)
    @Column(name = "message_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @NotNull
    @Column(name = "chat_id", nullable = false)
    private UUID chatId;

    @NotNull
    @Size(max = 1200)
    @Column(name = "text", nullable = false, length = 1200)
    private String text;

    @jakarta.validation.constraints.NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "edit_at")
    private Instant editAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

}