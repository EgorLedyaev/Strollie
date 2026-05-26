package ru.riveo.authservice.controller.request;

import lombok.Data;

@Data
public class UserLoginRequest {

    private String username;
    private String password;

}
