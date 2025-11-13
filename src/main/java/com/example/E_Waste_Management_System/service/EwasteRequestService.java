package com.example.E_Waste_Management_System.service;

import com.example.E_Waste_Management_System.Model.Status;
import com.example.E_Waste_Management_System.Model.User;
import com.example.E_Waste_Management_System.dto.EwasteRequestDTO;
import com.example.E_Waste_Management_System.dto.EwasteResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface EwasteRequestService {
    EwasteResponseDTO createRequest(EwasteRequestDTO dto, User user);
    List<EwasteResponseDTO> getUserRequests(User user);

    // Admin methods
    List<EwasteResponseDTO> getAllRequests(String statusFilter);

    // Approve or reject (with reason for reject)
    EwasteResponseDTO updateStatus(Long requestId, Status status, String rejectReason);
    // Schedule separately
    EwasteResponseDTO schedulePickup(Long requestId, LocalDateTime scheduledAt, Long pickupPersonId);
    EwasteResponseDTO getRequestById(Long id);
    List<EwasteResponseDTO> getAssignedPickupsForCurrent();

    List<EwasteResponseDTO> getCompletedPickupsForCurrent();

    EwasteResponseDTO completePickup(Long requestId);         // generate OTP
    EwasteResponseDTO verifyOtp(Long requestId, String otp);  // verify OTP and mark as COMPLETE

}

