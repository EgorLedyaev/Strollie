package ru.riveo.strollie.authorization_server.features.role_management;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/roles")
@RequiredArgsConstructor
public class RoleManagementController {

    private final AssignRoleHandler handler;

    @PostMapping("/assign")
    @ResponseStatus(HttpStatus.OK)
    public void assignRole(@Valid @RequestBody AssignRoleCommand command) {
        handler.handle(command);
    }
}
