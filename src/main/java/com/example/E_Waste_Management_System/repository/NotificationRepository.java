package com.example.E_Waste_Management_System.repository;

import com.example.E_Waste_Management_System.Model.Notification;
import com.example.E_Waste_Management_System.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Get all notifications for a user, ordered by creation time (newest first)
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    // Get unread notifications for a user
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);

    // Count unread notifications for a user
    long countByUserAndIsReadFalse(User user);

    // Mark all notifications as read for a user
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user AND n.isRead = false")
    void markAllAsReadForUser(@Param("user") User user);

    // Get recent notifications (last 30 days) for a user
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.createdAt >= :cutoffDate ORDER BY n.createdAt DESC")
    List<Notification> findRecentNotificationsForUser(@Param("user") User user, @Param("cutoffDate") LocalDateTime cutoffDate);
}