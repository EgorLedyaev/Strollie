package ru.riveo.strollie.personalcabinet.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.errors.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.riveo.strollie.personalcabinet.entity.UserEntity;
import ru.riveo.strollie.personalcabinet.exception.AvatarNotFoundException;
import ru.riveo.strollie.personalcabinet.repository.UserRepository;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AvatarService {

    private final UserRepository userRepository;
    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucketName;

    @Value("${minio.endpoint}")
    private String minioUrl;

    public String uploadAvatar(UUID userId, MultipartFile file) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {

        UserEntity user = userRepository.findUserEntitiesById(userId)
                .orElseGet(() -> {
                    UserEntity newUser = new UserEntity();
                    newUser.setId(userId);
                    return userRepository.save(newUser);
                });

        if (user.getUserAvatarUrl() != null && !user.getUserAvatarUrl().isEmpty()) {
            String oldObjectName = user.getUserAvatarUrl().replace(minioUrl + "/" + bucketName + "/", "");
            try {
                minioClient.removeObject(
                        RemoveObjectArgs.builder()
                                .bucket(bucketName)
                                .object(oldObjectName)
                                .build()
                );
            } catch (Exception e) {
                throw new RuntimeException("Failed to delete old avatar from MinIO: " + e.getMessage(), e);
            }
        }

        String hash = generateFileHash(file);
        String objectName = userId + "/" + hash;

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );

        user.setUserAvatarUrl(minioUrl + "/" + bucketName + "/" + objectName);
        userRepository.save(user);

        return user.getUserAvatarUrl();
    }

    public void deleteAvatar(UUID userId) throws AvatarNotFoundException {
        UserEntity user = userRepository.findUserEntitiesById(userId)
                .orElseThrow(() -> new AvatarNotFoundException("User with ID " + userId + " not found."));

        if (user.getUserAvatarUrl() == null || user.getUserAvatarUrl().isEmpty()) {
            throw new RuntimeException("User does not have an avatar to delete.");
        }

        String objectName = user.getUserAvatarUrl().replace(minioUrl + "/" + bucketName + "/", "");

        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete avatar from MinIO: " + e.getMessage(), e);
        }

        user.setUserAvatarUrl(null);
        userRepository.save(user);
    }

    private String generateFileHash(MultipartFile file) throws NoSuchAlgorithmException, IOException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(file.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }
}
