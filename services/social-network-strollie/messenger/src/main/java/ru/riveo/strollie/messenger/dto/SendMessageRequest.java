package ru.riveo.strollie.messenger.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.UUID;

@Data
public class SendMessageRequest {
    @NotNull
    private UUID chatId;

    @NotBlank
    @Size(max = 2000)
    private String content;
}