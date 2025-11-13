package com.example.E_Waste_Management_System.service.impl;

import com.example.E_Waste_Management_System.Model.Certificate;
import com.example.E_Waste_Management_System.Model.EwasteRequest;
import com.example.E_Waste_Management_System.Model.PickupPerson;
import com.example.E_Waste_Management_System.Model.User;
import com.example.E_Waste_Management_System.service.NotificationService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender mailSender;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Map to store active emitters
    private final ConcurrentHashMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    // register method for SSE
    public SseEmitter register(String email) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // never timeout
        emitters.put(email, emitter);

        // Remove emitter on complete or timeout
        emitter.onCompletion(() -> emitters.remove(email));
        emitter.onTimeout(() -> emitters.remove(email));

        return emitter;
    }

    // You can add a method to send SSE notifications
    public void sendSseNotification(String email, String message) {
        SseEmitter emitter = emitters.get(email);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().data(message));
            } catch (Exception e) {
                emitters.remove(email);
            }
        }
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // true = enable HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendWelcomeEmail(User user) {
        String subject = "🌱 Welcome to E-Waste Management!";
        String body = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
        </head>
        <body style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px; margin:0;">
            <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden;">
                <tr>
                    <td style="background:#4CAF50; padding:20px; text-align:center; color:#ffffff;">
                        <h1 style="margin:0;">Welcome, %s! 🎉</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:30px; color:#333333; line-height:1.6;">
                        <p>Thank you for registering with our <b>E-Waste Management System</b>.</p>
                        <p>We are excited to have you onboard! 🌍 Together, we can make a cleaner and greener environment.</p>
                        <p style="margin-top:20px;">
                            <a href="http://localhost:3000/login" 
                               style="background:#4CAF50; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:5px; display:inline-block;">
                                Get Started
                            </a>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background:#f4f4f4; padding:15px; text-align:center; color:#777777; font-size:12px;">
                        <p>© 2025 E-Waste Management. All rights reserved.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """.replace("%s", user.getName());

        sendEmail(user.getEmail(), subject, body);
    }

    @Override
    public void sendSubmissionEmail(EwasteRequest request) {
        String subject = "✅ Your E-Waste Request has been submitted!";
        String body = """
        <html>
        <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
            <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px; overflow:hidden;">
                <tr>
                    <td style="background:#4CAF50; padding:20px; color:white; text-align:center;">
                        <h2 style="margin:0;">Request Submitted</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px; color:#333; line-height:1.6;">
                        <p>Hello <b>%s</b>,</p>
                        <p>Your request for pickup of <b>%d × %s (%s)</b> has been submitted successfully.</p>
                        <p><b>Pickup time slot:</b> %s</p>
                        <p>We’ll notify you once our admin reviews your request.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    """.formatted(
                request.getUser().getName(),
                request.getQuantity(),
                request.getDeviceType(),
                request.getCondition(),
                request.getPickupTimeSlot()
        );
        sendEmail(request.getUser().getEmail(), subject, body);
    }

    @Override
    public void sendApprovedEmail(EwasteRequest request) {
        String subject = "🎉 Your E-Waste Request is Approved!";
        String body = """
        <html>
        <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
            <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px;">
                <tr>
                    <td style="background:#4CAF50; padding:20px; text-align:center; color:#fff;">
                        <h2 style="margin:0;">Request Approved</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px; color:#333;">
                        <p>Hello <b>%s</b>,</p>
                        <p>Good news! Your request for pickup of <b>%d × %s</b> has been <b style="color:green;">APPROVED ✅</b>.</p>
                        <p>but, not yet scheduled, Our team will schedule the pickup soon. Stay tuned!</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    """.formatted(
                request.getUser().getName(),
                request.getQuantity(),
                request.getDeviceType()
        );
        sendEmail(request.getUser().getEmail(), subject, body);
    }

    @Override
    public void sendRejectionEmail(EwasteRequest request) {
        String subject = "❌ Your E-Waste Request was Rejected";
        String body = """
        <html>
        <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
            <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px;">
                <tr>
                    <td style="background:#f44336; padding:20px; text-align:center; color:#fff;">
                        <h2 style="margin:0;">Request Rejected</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px; color:#333;">
                        <p>Hello <b>%s</b>,</p>
                        <p>Unfortunately, your request for <b>%s</b> was <b style="color:red;">REJECTED</b>.</p>
                        <p><b>Reason:</b> %s</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    """.formatted(
                request.getUser().getName(),
                request.getDeviceType(),
                request.getRejectionReason() != null ? request.getRejectionReason() : "No reason provided"
        );
        sendEmail(request.getUser().getEmail(), subject, body);
    }

    @Override
    public void sendScheduledEmail(EwasteRequest request) {
        String subject = "📅 Your Pickup is Scheduled!";
        String body = """
        <html>
        <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
            <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px;">
                <tr>
                    <td style="background:#2196F3; padding:20px; text-align:center; color:#fff;">
                        <h2 style="margin:0;">Pickup Scheduled</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px; color:#333;">
                        <p>Hello <b>%s</b>,</p>
                        <p>Your request for <b>%s</b> has been scheduled.</p>
                        <p><b>Date & Time:</b> %s</p>
                        <p>Thank you for contributing to a greener environment! 🌱</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    """.formatted(
                request.getUser().getName(),
                request.getDeviceType(),
                request.getPickupDateTime() != null ? request.getPickupDateTime() : "Not specified"
        );
        sendEmail(request.getUser().getEmail(), subject, body);
    }

    public void sendOtpEmail(EwasteRequest request, String otp) {
        String subject = "🔐 Your OTP for E-Waste Pickup";
        String body = """
        <html>
        <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
            <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px;">
                <tr>
                    <td style="background:#ff9800; padding:20px; text-align:center; color:#fff;">
                        <h2 style="margin:0;">Pickup OTP</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px; color:#333;">
                        <p>Hello <b>%s</b>,</p>
                        <p>Your OTP to confirm the E-Waste pickup is:</p>
                        <h2 style="color:#ff5722; text-align:center;">%s</h2>
                        <p>Please provide this OTP to the pickup person to complete the process.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    """.formatted(request.getUser().getName(), otp);
        sendEmail(request.getUser().getEmail(), subject, body);
    }

    public void sendCompletionEmail(EwasteRequest request) {
        String subject = "🌍 E-Waste Pickup Completed!";
        String body = """
        <html>
        <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
            <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px;">
                <tr>
                    <td style="background:#4CAF50; padding:20px; text-align:center; color:#fff;">
                        <h2 style="margin:0;">Pickup Completed</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px; color:#333;">
                        <p>Hello <b>%s</b>,</p>
                        <p>Your scheduled E-Waste pickup has been <b style="color:green;">completed successfully ✅</b>.</p>
                        <p>Thank you for contributing to a greener environment! 🌱</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    """.formatted(request.getUser().getName());
        sendEmail(request.getUser().getEmail(), subject, body);
    }

    @Override
    public void sendPickupPersonWelcomeEmail(PickupPerson person, String rawPassword) {
        String subject = "🚛 Welcome to E-Waste Management as Pickup Personnel!";
        String body = """
    <html>
    <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
        <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px;">
            <tr>
                <td style="background:#4CAF50; padding:20px; text-align:center; color:#fff;">
                    <h2 style="margin:0;">Welcome, %s 🎉</h2>
                </td>
            </tr>
            <tr>
                <td style="padding:20px; color:#333;">
                    <p>Dear <b>%s</b>,</p>
                    <p>You have been appointed as a <b>Pickup Personnel</b> in the <b>E-Waste Management System</b>.</p>
                    <p>Here are your credentials to log in:</p>
                    <ul>
                        <li><b>Username/Email:</b> %s</li>
                        <li><b>Password:</b> %s</li>
                    </ul>
                    <p>Please log in at <a href="http://localhost:3000/login">E-Waste Portal</a> and start managing assigned pickups.</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """.formatted(person.getName(), person.getName(), person.getEmail(), rawPassword);

        sendEmail(person.getEmail(), subject, body);
    }

    @Override
    public void sendPickupAssignmentEmail(PickupPerson person, EwasteRequest request) {
        String subject = "📦 New Pickup Assigned!";
        String body = """
    <html>
    <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
        <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px;">
            <tr>
                <td style="background:#2196F3; padding:20px; text-align:center; color:#fff;">
                    <h2 style="margin:0;">New Pickup Assigned</h2>
                </td>
            </tr>
            <tr>
                <td style="padding:20px; color:#333;">
                    <p>Hello <b>%s</b>,</p>
                    <p>A new pickup request has been assigned to you.</p>
                    <p><b>Device:</b> %s (%s)<br/>
                       <b>Quantity:</b> %d<br/>
                       <b>Pickup Address:</b> %s<br/>
                       <b>Date & Time:</b> %s</p>
                    <p>Please log in to your dashboard for more details.</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """.formatted(
                person.getName(),
                request.getDeviceType(),
                request.getCondition(),
                request.getQuantity(),
                request.getPickupAddress(),
                request.getPickupDateTime()
        );

        sendEmail(person.getEmail(), subject, body);
    }

    @Override
    public void sendCertificateEmail(User user, Certificate certificate, String pdfPath) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(user.getEmail());
            helper.setSubject("🏆 Congratulations! Certificate of Appreciation Earned");

            String body = """
        <html>
        <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
            <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px;">
                <tr>
                    <td style="background:#4CAF50; padding:20px; text-align:center; color:#fff;">
                        <h2 style="margin:0;">🏆 Certificate Earned!</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px; color:#333;">
                        <p>Dear <b>%s</b>,</p>
                        <p>Congratulations! You have earned a <b>Certificate of Appreciation</b> for your outstanding contribution to environmental sustainability.</p>
                        <p>You have successfully completed <b>%d e-waste pickup requests</b>, showing your commitment to a cleaner environment.</p>
                        <p>Please find your certificate attached to this email.</p>
                        <p>Thank you for making a difference! 🌱</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """.formatted(user.getName(), certificate.getCompletedRequests());

            helper.setText(body, true);

            // Attach certificate PDF
            Path certificatePath = Paths.get(uploadDir, pdfPath);
            if (Files.exists(certificatePath)) {
                helper.addAttachment("Certificate_of_Appreciation.pdf", certificatePath.toFile());
            }

            mailSender.send(message);
            System.out.println("Certificate email sent successfully to " + user.getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send certificate email: " + e.getMessage());
            e.printStackTrace();
            // Don't rethrow - we don't want email failure to break certificate generation
        }
    }
}
