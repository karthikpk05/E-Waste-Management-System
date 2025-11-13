package com.example.E_Waste_Management_System.controller;

import com.example.E_Waste_Management_System.dto.EwasteResponseDTO;
import com.example.E_Waste_Management_System.service.EwasteRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/pickup")
@RequiredArgsConstructor
public class PickupPersonController {

    private final EwasteRequestService service;

    // List all assigned pickups for the logged-in pickup person
    @GetMapping("/assigned")
    public ResponseEntity<List<EwasteResponseDTO>> getAssignedPickups() {
        return ResponseEntity.ok(service.getAssignedPickupsForCurrent());
    }

    // Get completed pickups history
    @GetMapping("/completed")
    public ResponseEntity<List<EwasteResponseDTO>> getCompletedPickups() {
        return ResponseEntity.ok(service.getCompletedPickupsForCurrent());
    }


    // Mark request as complete → generates OTP and sends to user email
    @PutMapping("/{id}/complete")
    public ResponseEntity<EwasteResponseDTO> completePickup(@PathVariable Long id) {
        return ResponseEntity.ok(service.completePickup(id));
    }

    // Verify OTP entered by pickup person
    @PutMapping("/{id}/verify-otp")
    public ResponseEntity<EwasteResponseDTO> verifyOtp(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String otp = body.get("otp");
        return ResponseEntity.ok(service.verifyOtp(id, otp));
    }
}
