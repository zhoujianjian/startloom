package com.starloom.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public void sendVerifyCode(String to, String code, String language) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            
            if ("zh".equals(language)) {
                message.setSubject("StarLoom - 验证码");
                message.setText("您的验证码是：" + code + "，有效期10分钟，请勿泄露给他人。");
            } else {
                message.setSubject("StarLoom - Verification Code");
                message.setText("Your verification code is: " + code + ". Valid for 10 minutes. Do not share with others.");
            }
            
            mailSender.send(message);
            log.info("验证码邮件发送成功: {}", to);
        } catch (Exception e) {
            log.error("邮件发送失败: {}", e.getMessage());
        }
    }
}
