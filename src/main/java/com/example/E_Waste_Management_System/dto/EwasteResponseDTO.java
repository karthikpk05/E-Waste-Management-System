package com.example.E_Waste_Management_System.dto;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class EwasteResponseDTO {
    private Long requestId;
    private String deviceType;
    private String brand;
    private String model;
    private String condition;
    private int quantity;
    private String[] imagePaths;
    private String pickupAddress;
    private String remarks;
    private String status;
    private String createdAt;

    // Milestone 3 fields
    private String pickupDateTime;
    private String pickupPersonnel;
    private String rejectionReason;
    private String pickupTimeSlot;

    // ✅ Add user info
    private String userName;
    private String userEmail;
    private String userPhone;

    private String completedAt;

    // ✅ New fields
    private Double latitude;
    private Double longitude;
}


//import lombok.Builder;
//import lombok.Data;
//
//@Data
//@Builder
//public class EwasteResponseDTO {
//    private Long requestId;
//    private String deviceType;
//    private String brand;
//    private String model;
//    private String condition;
//    private int quantity;
//    private String[] imagePaths;
//    private String pickupAddress;
//    private String remarks;
//    private String status;
//    private String createdAt;
//
//    // Milestone 3 additions
//    private String scheduledAt;
//    private String pickupPersonnel;
//    private String rejectReason;
//}
