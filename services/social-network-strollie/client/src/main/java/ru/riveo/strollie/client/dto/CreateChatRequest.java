package ru.riveo.strollie.client.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateChatRequest {
    @Size(max = 50)
    private String chatName;

    @NotEmpty
    private List<String> participantUsernames;
}