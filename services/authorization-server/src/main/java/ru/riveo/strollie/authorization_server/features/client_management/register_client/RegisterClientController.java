package ru.riveo.strollie.authorization_server.features.client_management.register_client;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class RegisterClientController {

    private final RegisterClientHandler handler;

    @PostMapping
    public ResponseEntity<RegisterClientResponse> register(@Valid @RequestBody RegisterClientCommand command) {
        RegisterClientResponse response = handler.handle(command);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
