package com.example.E_Waste_Management_System.controller;

import com.example.E_Waste_Management_System.dto.NotificationResponseDTO;
import com.example.E_Waste_Management_System.dto.NotificationStatsDTO;
import com.example.E_Waste_Management_System.service.NotificationServiceEnhanced;
import com.example.E_Waste_Management_System.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationServiceEnhanced notificationService;
    private final NotificationServiceImpl sseNotificationService; // For SSE

    // Keep existing SSE endpoint
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        return sseNotificationService.register(email);
    }

    /**
     * Get all notifications for the current user (Bell icon notifications)
     */
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications() {
        List<NotificationResponseDTO> notifications = notificationService.getAllNotificationsForCurrentUser();
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notifications for the current user
     */
    @GetMapping("/unread")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<NotificationResponseDTO>> getUnreadNotifications() {
        List<NotificationResponseDTO> notifications = notificationService.getUnreadNotificationsForCurrentUser();
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get notification statistics (total and unread count)
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<NotificationStatsDTO> getNotificationStats() {
        NotificationStatsDTO stats = notificationService.getNotificationStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Mark a single notification as read
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> markNotificationAsRead(@PathVariable Long id) {
        try {
            notificationService.markAsRead(id);
            return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Mark all notifications as read for the current user
     */
    @PutMapping("/read-all")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> markAllNotificationsAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}