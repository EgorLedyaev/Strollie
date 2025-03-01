package ru.riveo.personal_cabinet_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.riveo.personal_cabinet_service.api.UserApi;
import ru.riveo.personal_cabinet_service.api.request.StatusRequest;
import ru.riveo.personal_cabinet_service.api.request.UsernameRequest;


@RestController
@RequestMapping("api/me")
public class UserController implements UserApi {

    @Override
    public ResponseEntity<Void> updateNickname(Long userId, UsernameRequest request, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<Void> updateStatus(Long userId, StatusRequest request, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<String> uploadAvatar(Long userId, MultipartFile file, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<Void> deleteAvatar(Long userId, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<String> getAvatarUrl(Long userId, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<String> getNickname(Long userId, Authentication authentication) {
        return null;
    }

    @Override
    public ResponseEntity<String> getStatus(Long userId, Authentication authentication) {
        return null;
    }
}
