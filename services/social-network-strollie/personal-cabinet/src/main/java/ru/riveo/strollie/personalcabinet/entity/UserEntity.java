package ru.riveo.strollie.personalcabinet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users", schema = "public")
public class UserEntity {

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID id;

    @Size(max = 255)
    @Column(name = "user_avatar_url")
    private String userAvatarUrl;

}