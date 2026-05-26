package ru.riveo.strollie.messenger.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "participants_t")
public class ParticipantsEntity {

    @EmbeddedId
    private ParticipantsEntityId id;

}