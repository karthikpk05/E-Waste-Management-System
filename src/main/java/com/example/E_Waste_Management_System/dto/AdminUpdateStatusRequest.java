package com.example.E_Waste_Management_System.dto;

import lombok.Data;

@Data
public class AdminUpdateStatusRequest {
    private Long requestId;
    private String status;      // PENDING / APPROVED / REJECTED / SCHEDULED
    private String rejectReason; // optional, used when status == REJECTED
}
