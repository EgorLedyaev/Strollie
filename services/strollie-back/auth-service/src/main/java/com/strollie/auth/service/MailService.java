package com.strollie.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    
    private static final Logger log = LoggerFactory.getLogger(MailService.class);
    private final JavaMailSender mailSender;
    private final String from;
    private final String subjectOtp;

    public MailService(JavaMailSender mailSender,
                       @Value("${mail.from}") String from,
                       @Value("${mail.subject-otp}") String subjectOtp) {
        this.mailSender = mailSender;
        this.from = from;
        this.subjectOtp = subjectOtp;
    }

    public void sendOtp(String to, String code, long ttlMinutes) {
        String text = "Ваш одноразовый код: " + code + "\n" +
                "Действителен " + ttlMinutes + " минут.\n" +
                "Если вы не запрашивали код, просто игнорируйте это письмо.";
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject(subjectOtp);
        msg.setText(text);
        try {
            mailSender.send(msg);
            log.info("OTP email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage());
        }
    }

}