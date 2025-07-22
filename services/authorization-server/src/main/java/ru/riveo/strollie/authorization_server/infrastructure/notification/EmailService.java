package ru.riveo.strollie.authorization_server.infrastructure.notification;

public interface EmailService {
    void sendOtpEmail(String to, String otp);
}
