package com.example.E_Waste_Management_System.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationResponseDTO {
    private Long id;
    private String message;
    private Boolean isRead;
    private String createdAt;
    private String notificationType;
    private Long relatedEntityId;
}