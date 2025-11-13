package com.example.E_Waste_Management_System.controller;

import com.example.E_Waste_Management_System.Model.User;
import com.example.E_Waste_Management_System.dto.EwasteRequestDTO;
import com.example.E_Waste_Management_System.dto.EwasteResponseDTO;
import com.example.E_Waste_Management_System.repository.UserRepository;
import com.example.E_Waste_Management_System.service.EwasteRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class EwasteRequestController {

    private final EwasteRequestService requestService;
    private final UserRepository userRepository;   // ✅ inject via constructor

    @PostMapping("/submit")
    public ResponseEntity<?> createRequest(
            @ModelAttribute EwasteRequestDTO dto,
            @AuthenticationPrincipal UserDetails principal
    ) {
        // fetch the real User entity from DB
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getImages() == null || dto.getImages().length < 5) {
            return ResponseEntity
                    .badRequest()
                    .body("You must upload at least 5 device images.");
        }

        EwasteResponseDTO response = requestService.createRequest(dto, user);
        return ResponseEntity.ok(response);

//        return requestService.createRequest(dto, user);
    }

    @GetMapping("/my")
    public List<EwasteResponseDTO> getMyRequests(@AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return requestService.getUserRequests(user);
    }
}



//import com.example.E_Waste_Management_System.Model.User;
//import com.example.E_Waste_Management_System.dto.EwasteRequestDTO;
//import com.example.E_Waste_Management_System.dto.EwasteResponseDTO;
//import com.example.E_Waste_Management_System.repository.UserRepository;
//import com.example.E_Waste_Management_System.service.EwasteRequestService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//        import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/requests")
//@RequiredArgsConstructor
//public class EwasteRequestController {
//
//    private final EwasteRequestService requestService;
//
//
//
//    @PostMapping("/submit")
//    public EwasteResponseDTO createRequest(
//            @ModelAttribute EwasteRequestDTO dto,
//            @AuthenticationPrincipal User user
//    ) {
//        return requestService.createRequest(dto, user);
//    }
//
//    @GetMapping("/my")
//    public List<EwasteResponseDTO> getMyRequests(@AuthenticationPrincipal User user) {
//        return requestService.getUserRequests(user);
//    }
//}
