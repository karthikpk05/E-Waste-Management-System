package com.example.E_Waste_Management_System.service;

import com.example.E_Waste_Management_System.dto.ProfileUpdateRequest;
import com.example.E_Waste_Management_System.Model.User;

public interface UserService {
    User getCurrentUser();
    User updateProfile(ProfileUpdateRequest req);
}
