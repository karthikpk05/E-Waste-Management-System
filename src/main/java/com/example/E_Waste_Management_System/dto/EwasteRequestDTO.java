package com.example.E_Waste_Management_System.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EwasteRequestDTO {
    private String deviceType;
    private String brand;
    private String model;
    private String condition;
    private int quantity;
    private MultipartFile[] images;
    private String pickupAddress;
    private String remarks;
    private String pickupTimeSlot; // NEW: "6-11", "11-3", "3-7"

    // ✅ New fields
    private Double latitude;
    private Double longitude;
}
