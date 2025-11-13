package com.example.E_Waste_Management_System.service.impl;

import com.example.E_Waste_Management_System.dto.ProfileUpdateRequest;
import com.example.E_Waste_Management_System.Model.User;
import com.example.E_Waste_Management_System.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.example.E_Waste_Management_System.service.UserService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;

    @Override
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow();
    }

    @Override
    public User updateProfile(ProfileUpdateRequest req) {
        User u = getCurrentUser();
        if (req.getName() != null) u.setName(req.getName());
        if (req.getPhone() != null) u.setPhone(req.getPhone());
        if (req.getPickupAddress() != null) u.setPickupAddress(req.getPickupAddress());
        if (req.getPickupLatitude() != null) u.setPickupLatitude(req.getPickupLatitude());      // ✅ ADD
        if (req.getPickupLongitude() != null) u.setPickupLongitude(req.getPickupLongitude());  // ✅ ADD
        if (req.getProfilePicture() != null) u.setProfilePicture(req.getProfilePicture());
        return userRepo.save(u);
    }
}
