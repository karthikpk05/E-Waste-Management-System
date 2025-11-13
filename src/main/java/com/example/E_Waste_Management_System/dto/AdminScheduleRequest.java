package com.example.E_Waste_Management_System.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminScheduleRequest {
    private Long requestId;
    private LocalDateTime scheduledAt; // ISO-8601 from client
    private String pickupPersonnel;    // optional
}
