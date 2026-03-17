package com.tuan.jobmarket.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    void sendSimpleEmail();
    void sendEmailSync(String to, String subject, String content, boolean isMultipart, boolean isHtml);
    @Async
    void sendEmailFromTemplateSync(
            String to,
            String subject,
            String templateName,
            String username,
            Object value);
}
