package com.example.E_Waste_Management_System.service;

import com.example.E_Waste_Management_System.Model.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface NotificationService {
    SseEmitter register(String email);
    void sendWelcomeEmail(User user);
    void sendSubmissionEmail(EwasteRequest request);
    void sendApprovedEmail(EwasteRequest request);
    void sendRejectionEmail(EwasteRequest request);
    void sendScheduledEmail(EwasteRequest request);
    void sendOtpEmail(EwasteRequest request, String otp);
    void sendCompletionEmail(EwasteRequest request);
    void sendPickupPersonWelcomeEmail(PickupPerson person, String rawPassword);
    void sendPickupAssignmentEmail(PickupPerson person, EwasteRequest request);
    void sendCertificateEmail(User user, Certificate certificate, String pdfPath);
}
