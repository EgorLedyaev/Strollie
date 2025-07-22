package ru.riveo.strollie.authorization_server.shared.security;

import java.security.SecureRandom;

import org.springframework.stereotype.Service;

@Service
public class OtpGenerator {

    private static final SecureRandom random = new SecureRandom();
    private static final int OTP_LENGTH = 4;

    /**
     * Generates a random 4-digit OTP.
     * 
     * @return A string representing the 4-digit code.
     */
    public String generate() {
        int number = random.nextInt((int) Math.pow(10, OTP_LENGTH));
        return String.format("%0" + OTP_LENGTH + "d", number);
    }
}
