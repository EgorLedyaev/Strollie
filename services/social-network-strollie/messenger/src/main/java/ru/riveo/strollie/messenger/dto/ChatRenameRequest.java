package ru.riveo.strollie.messenger.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChatRenameRequest {
    @NotBlank(message = "New chat name cannot be blank")
    @Size(max = 50, message = "Chat name must be less than 50 characters")
    private String name;
}
