package com.example.E_Waste_Management_System.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private String accessToken;
    private String refreshToken;
    private String principal; // USER or ADMIN

    // add user details
    private String name;
    private String email;
    private String profilePicture;

    public AuthResponse(String message, String accessToken, String refreshToken, String principal) {
        this.message = message;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.principal = principal;
    }
}

