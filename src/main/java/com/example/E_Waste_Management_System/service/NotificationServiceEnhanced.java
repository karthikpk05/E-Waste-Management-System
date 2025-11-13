package com.example.E_Waste_Management_System.service;

import com.example.E_Waste_Management_System.Model.Notification;
import com.example.E_Waste_Management_System.Model.User;
import com.example.E_Waste_Management_System.dto.NotificationResponseDTO;
import com.example.E_Waste_Management_System.dto.NotificationStatsDTO;
import com.example.E_Waste_Management_System.repository.NotificationRepository;
import com.example.E_Waste_Management_System.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceEnhanced {

    private final NotificationRepository notificationRepo;
    private final UserRepository userRepo;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    /**
     * Create a new notification for a user
     */
    public void createNotification(User user, String message, String type, Long relatedEntityId) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .notificationType(type)
                .relatedEntityId(relatedEntityId)
                .isRead(false)
                .build();

        notificationRepo.save(notification);
    }

    /**
     * Get all notifications for current logged-in user
     */
    public List<NotificationResponseDTO> getAllNotificationsForCurrentUser() {
        User currentUser = getCurrentUser();
        List<Notification> notifications = notificationRepo.findByUserOrderByCreatedAtDesc(currentUser);

        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get unread notifications for current user
     */
    public List<NotificationResponseDTO> getUnreadNotificationsForCurrentUser() {
        User currentUser = getCurrentUser();
        List<Notification> notifications = notificationRepo.findByUserAndIsReadFalseOrderByCreatedAtDesc(currentUser);

        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get notification statistics (total and unread count)
     */
    public NotificationStatsDTO getNotificationStats() {
        User currentUser = getCurrentUser();
        long totalCount = notificationRepo.findByUserOrderByCreatedAtDesc(currentUser).size();
        long unreadCount = notificationRepo.countByUserAndIsReadFalse(currentUser);

        return new NotificationStatsDTO(totalCount, unreadCount);
    }

    /**
     * Mark a single notification as read
     */
    public void markAsRead(Long notificationId) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Security check: ensure the notification belongs to the current user
        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notification.setIsRead(true);
        notificationRepo.save(notification);
    }

    /**
     * Mark all notifications as read for current user
     */
    public void markAllAsRead() {
        User currentUser = getCurrentUser();
        notificationRepo.markAllAsReadForUser(currentUser);
    }

    /**
     * Get recent notifications (last 30 days) for current user**/
    public List<NotificationResponseDTO> getRecentNotificationsForCurrentUser() {
        User currentUser = getCurrentUser();
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        List<Notification> notifications = notificationRepo.findRecentNotificationsForUser(currentUser, cutoffDate);

        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Helper method to get current authenticated user
     */
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Convert Notification entity to DTO
     */
    private NotificationResponseDTO convertToDTO(Notification notification) {
        return NotificationResponseDTO.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt().format(FORMATTER))
                .notificationType(notification.getNotificationType())
                .relatedEntityId(notification.getRelatedEntityId())
                .build();
    }

    // Convenience methods for common notification types
    public void createRequestSubmittedNotification(User user, Long requestId) {
        createNotification(user, "Your e-waste pickup request has been submitted successfully.",
                "REQUEST_SUBMITTED", requestId);
    }

    public void createRequestApprovedNotification(User user, Long requestId) {
        createNotification(user, "Great news! Your e-waste pickup request has been approved.",
                "REQUEST_APPROVED", requestId);
    }

    public void createRequestRejectedNotification(User user, Long requestId, String reason) {
        String message = "Your e-waste pickup request has been rejected." +
                (reason != null ? " Reason: " + reason : "");
        createNotification(user, message, "REQUEST_REJECTED", requestId);
    }

    public void createRequestScheduledNotification(User user, Long requestId) {
        createNotification(user, "Your e-waste pickup has been scheduled! Check your email for details.",
                "REQUEST_SCHEDULED", requestId);
    }

    public void createRequestCompletedNotification(User user, Long requestId) {
        createNotification(user, "Your e-waste pickup has been completed successfully. Thank you for contributing to a greener environment!",
                "REQUEST_COMPLETED", requestId);
    }

    public void createCertificateEarnedNotification(User user, int completedRequests) {
        createNotification(user, String.format("Congratulations! You've earned a Certificate of Appreciation for completing %d e-waste requests!", completedRequests),
                "CERTIFICATE_EARNED", null);
    }
}