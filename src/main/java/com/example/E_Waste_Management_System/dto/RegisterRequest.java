package com.example.E_Waste_Management_System.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String pickupAddress;

    private Double pickupLatitude;
    private Double pickupLongitude;
}

