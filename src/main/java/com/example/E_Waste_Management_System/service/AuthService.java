package com.example.E_Waste_Management_System.service;


import com.example.E_Waste_Management_System.dto.AuthResponse;
import com.example.E_Waste_Management_System.dto.LoginRequest;
import com.example.E_Waste_Management_System.dto.RefreshTokenRequest;
import com.example.E_Waste_Management_System.dto.RegisterRequest;

public interface AuthService {
    String registerUser(RegisterRequest request);
    AuthResponse loginUser(LoginRequest request);
    AuthResponse loginAdmin(LoginRequest request);
    AuthResponse loginPickup(LoginRequest request);
    AuthResponse refresh(RefreshTokenRequest request);
    void logout(String email); // optional: revoke refresh tokens for email
}
