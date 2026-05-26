package ru.riveo.strollie.messenger.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class ParticipantsEntityId implements Serializable {
    private static final long serialVersionUID = 5254018569960383700L;
    @NotNull
    @Column(name = "chat_id", nullable = false)
    private UUID chatId;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ParticipantsEntityId entity = (ParticipantsEntityId) o;
        return Objects.equals(this.chatId, entity.chatId) &&
                Objects.equals(this.userId, entity.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chatId, userId);
    }

}