package ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.port;

public interface EmailService {
    void sendOtpEmail(String to, String otp);
}
