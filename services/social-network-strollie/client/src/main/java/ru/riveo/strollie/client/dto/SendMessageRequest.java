package ru.riveo.strollie.client.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    @NotNull(message = "Chat ID cannot be null")
    private UUID chatId;

    @NotBlank(message = "Message content cannot be blank")
    @Size(max = 2000, message = "Message content must be less than 2000 characters")
    private String content;
}
