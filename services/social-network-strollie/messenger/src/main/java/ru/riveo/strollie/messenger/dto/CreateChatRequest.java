package ru.riveo.strollie.messenger.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CreateChatRequest {
    @Size(max = 50)
    private String chatName;

    @NotEmpty
    private List<String> participantUsernames;
}