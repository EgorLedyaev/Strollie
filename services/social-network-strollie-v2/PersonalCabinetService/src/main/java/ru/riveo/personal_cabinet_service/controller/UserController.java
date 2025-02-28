package ru.riveo.personal_cabinet_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.riveo.personal_cabinet_service.api.UserApi;
import ru.riveo.personal_cabinet_service.api.request.NicknameRequest;
import ru.riveo.personal_cabinet_service.api.request.StatusRequest;


@RestController
@RequestMapping("api/me")
public class UserController implements UserApi {
    @Override
    public ResponseEntity<Void> updateNickname(NicknameRequest request, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<Void> updateStatus(StatusRequest request, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<String> uploadAvatar(MultipartFile file, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<Void> deleteAvatar(Authentication authentication) {
        return null;
    }
}
