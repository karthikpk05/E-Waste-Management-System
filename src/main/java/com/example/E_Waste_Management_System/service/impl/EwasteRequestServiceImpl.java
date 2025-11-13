package com.example.E_Waste_Management_System.service.impl;

import com.example.E_Waste_Management_System.Model.*;
import com.example.E_Waste_Management_System.dto.EwasteRequestDTO;
import com.example.E_Waste_Management_System.dto.EwasteResponseDTO;
import com.example.E_Waste_Management_System.repository.EwasteRequestRepository;
import com.example.E_Waste_Management_System.repository.PickupPersonRepository;
import com.example.E_Waste_Management_System.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EwasteRequestServiceImpl implements EwasteRequestService {

    private final EwasteRequestRepository repo;
    private final PickupPersonRepository pickupPersonRepo;
    private final FileStorageService fileStorage;
    private final NotificationService notificationService;
    private final CertificateService certificateService;
    private final NotificationServiceEnhanced notificationServiceEnhanced;



    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public EwasteResponseDTO createRequest(EwasteRequestDTO dto, User user) {
        List<String> savedNames = fileStorage.storeFiles(dto.getImages());

        Condition parsedCondition;
        try {
            parsedCondition = dto.getCondition() == null
                    ? Condition.DAMAGED
                    : Condition.valueOf(dto.getCondition().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid condition: " + dto.getCondition());
        }

        EwasteRequest request = EwasteRequest.builder()
                .user(user)
                .deviceType(dto.getDeviceType())
                .brand(dto.getBrand())
                .model(dto.getModel())
                .condition(parsedCondition)
                .quantity(dto.getQuantity())
                .imagePaths(String.join(",", savedNames))
                .pickupAddress(dto.getPickupAddress())
                .latitude(dto.getLatitude())   // ✅ save lat
                .longitude(dto.getLongitude()) // ✅ save lng
                .remarks(dto.getRemarks())
                .status(Status.PENDING)
                .pickupTimeSlot(dto.getPickupTimeSlot())
                .createdAt(LocalDateTime.now())
                .build();

//        repo.save(request);


        EwasteRequest savedRequest = repo.save(request);

        // Send email notification
        notificationService.sendSubmissionEmail(savedRequest);

        // 🔔 CREATE IN-APP NOTIFICATION
        notificationServiceEnhanced.createRequestSubmittedNotification(user, savedRequest.getRequestId());

        //notificationService.sendSubmissionEmail(request);

        return mapToResponseDTO(request);
    }

    @Override
    public List<EwasteResponseDTO> getUserRequests(User user) {
        return repo.findByUser(user).stream().map(this::mapToResponseDTO).toList();
    }

    @Override
    public List<EwasteResponseDTO> getAllRequests(String statusFilter) {
        if (statusFilter == null || statusFilter.isBlank()) {
            return repo.findAll().stream().map(this::mapToResponseDTO).toList();
        }
        Status status = Status.valueOf(statusFilter.toUpperCase());
        return repo.findByStatus(status).stream().map(this::mapToResponseDTO).toList();
    }

    // ✅ Approve / Reject
    @Override
    public EwasteResponseDTO updateStatus(Long requestId, Status status, String rejectReason) {
        return updateStatusInternal(requestId, status, null, null, rejectReason);
    }

    // ✅ Schedule
    @Override
    public EwasteResponseDTO schedulePickup(Long requestId, LocalDateTime scheduledAt, Long pickupPersonId) {
        PickupPerson pickup = pickupPersonRepo.findById(pickupPersonId)
                .orElseThrow(() -> new RuntimeException("Pickup person not found"));

        return updateStatusInternal(requestId, Status.SCHEDULED, scheduledAt, pickup, null);
    }

    private EwasteResponseDTO updateStatusInternal(Long requestId,
                                                   Status status,
                                                   LocalDateTime pickupDateTime,
                                                   PickupPerson pickupPerson,
                                                   String rejectionReason) {
        EwasteRequest req = repo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (status == Status.SCHEDULED && req.getStatus() != Status.APPROVED) {
            throw new RuntimeException("Can only schedule requests that are APPROVED");
        }

        req.setStatus(status);

        if (status == Status.REJECTED) {
            req.setRejectionReason(rejectionReason);
        }
        if (status == Status.SCHEDULED) {
            req.setPickupDateTime(pickupDateTime);
            req.setPickupPerson(pickupPerson);
        }


        repo.save(req);

        // ✅ Send emails
        switch (status) {
            case APPROVED -> {
                notificationService.sendApprovedEmail(req);
                notificationServiceEnhanced.createRequestApprovedNotification(req.getUser(), req.getRequestId());
            }
            case REJECTED -> {
                notificationService.sendRejectionEmail(req);
                notificationServiceEnhanced.createRequestRejectedNotification(req.getUser(), req.getRequestId(), rejectionReason);
            }
            case SCHEDULED -> {
                notificationService.sendScheduledEmail(req);
                notificationService.sendPickupAssignmentEmail(req.getPickupPerson(), req);
                notificationServiceEnhanced.createRequestScheduledNotification(req.getUser(), req.getRequestId());
            }
            case COMPLETED -> {
                notificationService.sendCompletionEmail(req);
                notificationServiceEnhanced.createRequestCompletedNotification(req.getUser(), req.getRequestId());
            }
            default -> { }
        }


        return mapToResponseDTO(req);
    }

    @Override
    public EwasteResponseDTO getRequestById(Long id) {
        EwasteRequest req = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        return mapToResponseDTO(req);
    }

//    private EwasteResponseDTO mapToResponseDTO(EwasteRequest req) {
//        return EwasteResponseDTO.builder()
//                .requestId(req.getRequestId())
//                .deviceType(req.getDeviceType())
//                .brand(req.getBrand())
//                .model(req.getModel())
//                .condition(req.getCondition().name())
//                .quantity(req.getQuantity())
//                .imagePaths(req.getImagePaths() != null && !req.getImagePaths().isBlank()
//                        ? req.getImagePaths().split(",")
//                        : new String[0])
//                .pickupAddress(req.getPickupAddress())
//                .remarks(req.getRemarks())
//                .status(req.getStatus().name())
//                .createdAt(req.getCreatedAt() == null ? null : req.getCreatedAt().toString())
//                .pickupDateTime(req.getPickupDateTime() == null ? null : req.getPickupDateTime().toString())
//                .pickupPersonnel(req.getPickupPersonnel())
//                .rejectionReason(req.getRejectionReason())
//                .pickupTimeSlot(req.getPickupTimeSlot())
//                .build();
//    }

//    @Override
//    public List<EwasteResponseDTO> getAssignedPickupsForCurrent() {
//        // Get logged-in pickup person (assuming Spring Security with username)
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        PickupPerson pickupPerson = pickupPersonRepo.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Pickup person not found"));
//
//        // Fetch all requests assigned to this pickup person
//        List<EwasteRequest> requests = repo.findByPickupPerson(pickupPerson);
//
//        return requests.stream()
//                .map(this::mapToResponseDTO)
//                .toList();
//    }


//    @Override
//    public List<EwasteResponseDTO> getAssignedPickupsForCurrent() {
//        // 1️⃣ Get the currently logged-in pickup person
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        PickupPerson pickupPerson = pickupPersonRepo.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Pickup person not found"));
//
//        // 2️⃣ Fetch only "SCHEDULED" requests assigned to them
//        List<EwasteRequest> requests = repo.findByPickupPersonAndStatus(pickupPerson, Status.SCHEDULED);
//
//        // 3️⃣ Convert entity → DTO
//        return requests.stream()
//                .map(this::convertToDto)
//                .collect(Collectors.toList());
//    }
//
//
//    @Override
//    public List<EwasteResponseDTO> getCompletedPickupsForCurrent() {
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        PickupPerson pickupPerson = pickupPersonRepo.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Pickup person not found"));
//
//        List<EwasteRequest> requests = repo.findByPickupPersonAndStatus(pickupPerson, Status.COMPLETED);
//
//        return requests.stream()
//                .map(this::convertToDto)
//                .collect(Collectors.toList());
//    }


    @Override
    public List<EwasteResponseDTO> getAssignedPickupsForCurrent() {
        // Get email instead of username
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        PickupPerson pickupPerson = pickupPersonRepo.findByEmail(email)  // Use findByEmail
                .orElseThrow(() -> new RuntimeException("Pickup person not found"));

        List<EwasteRequest> requests = repo.findByPickupPersonAndStatus(pickupPerson, Status.SCHEDULED);
        return requests.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EwasteResponseDTO> getCompletedPickupsForCurrent() {
        // Get email instead of username
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        PickupPerson pickupPerson = pickupPersonRepo.findByEmail(email)  // Use findByEmail
                .orElseThrow(() -> new RuntimeException("Pickup person not found"));

        List<EwasteRequest> requests = repo.findByPickupPersonAndStatus(pickupPerson, Status.COMPLETED);
        return requests.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private EwasteResponseDTO convertToDto(EwasteRequest request) {
        return EwasteResponseDTO.builder()
                .requestId(request.getRequestId())
                .deviceType(request.getDeviceType())
                .brand(request.getBrand())
                .model(request.getModel())
                .condition(request.getCondition() != null ? request.getCondition().name() : null)
                .quantity(request.getQuantity())
                .imagePaths(request.getImagePaths() != null
                        ? request.getImagePaths().split(",")
                        : null)
                .pickupAddress(request.getPickupAddress())
                .latitude(request.getLatitude())   // ✅ FIXED: Include latitude
                .longitude(request.getLongitude()) // ✅ FIXED: Include longitude
                .remarks(request.getRemarks())
                .status(request.getStatus() != null ? request.getStatus().name() : null)
                .createdAt(request.getCreatedAt() != null
                        ? request.getCreatedAt().toString()
                        : null)
                .pickupDateTime(request.getPickupDateTime() != null
                        ? request.getPickupDateTime().toString()
                        : null)
                .pickupPersonnel(request.getPickupPersonnel())
                .rejectionReason(request.getRejectionReason())
                .pickupTimeSlot(request.getPickupTimeSlot())
                .userName(request.getUser() != null ? request.getUser().getName() : null)
                .userEmail(request.getUser() != null ? request.getUser().getEmail() : null)
                .userPhone(request.getUser() != null ? request.getUser().getPhone() : null)
                .completedAt(request.getCompletedAt() != null
                        ? request.getCompletedAt().toString()
                        : null)
                .build();
    }



    @Override
    public EwasteResponseDTO completePickup(Long requestId) {
        EwasteRequest req = repo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getStatus() != Status.SCHEDULED) {
            throw new RuntimeException("Only scheduled requests can be completed");
        }

        // Generate OTP
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000); // 6-digit OTP
        req.setOtp(otp);
        req.setOtpGeneratedAt(LocalDateTime.now());
        repo.save(req);

        // Send OTP to user's email
        notificationService.sendOtpEmail(req, otp);

        return mapToResponseDTO(req);
    }

//    @Override
//    public EwasteResponseDTO verifyOtp(Long requestId, String otp) {
//        EwasteRequest req = repo.findById(requestId)
//                .orElseThrow(() -> new RuntimeException("Request not found"));
//
//        if (!otp.equals(req.getOtp())) {
//            throw new RuntimeException("Invalid OTP");
//        }
//
//        // Optional: check expiry
//        if (req.getOtpGeneratedAt().plusMinutes(15).isBefore(LocalDateTime.now())) {
//            throw new RuntimeException("OTP expired");
//        }
//
//        req.setStatus(Status.COMPLETED);
//        certificateService.checkAndGenerateCertificate(req.getUser());
//        req.setOtp(null);
//        req.setOtpGeneratedAt(null);
//        repo.save(req);
//
//        // Optional: send completion email
//        notificationService.sendCompletionEmail(req);
//
//        return mapToResponseDTO(req);
//    }

    @Override
    public EwasteResponseDTO verifyOtp(Long requestId, String otp) {
        EwasteRequest req = repo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!otp.equals(req.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        // Optional: check expiry
        if (req.getOtpGeneratedAt().plusMinutes(15).isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        req.setStatus(Status.COMPLETED);
        req.setCompletedAt(LocalDateTime.now());
        req.setOtp(null);
        req.setOtpGeneratedAt(null);
        repo.save(req);

        // Optional: send completion email
        notificationService.sendCompletionEmail(req);
        notificationServiceEnhanced.createRequestCompletedNotification(req.getUser(), req.getRequestId());
        // Check and generate certificate if milestone reached
        try {
            certificateService.checkAndGenerateCertificate(req.getUser());
        } catch (Exception e) {
            System.err.println("Certificate generation failed, but request completed: " + e.getMessage());
        }
        return mapToResponseDTO(req);
    }


    private EwasteResponseDTO mapToResponseDTO(EwasteRequest req) {
        return EwasteResponseDTO.builder()
                .requestId(req.getRequestId())
                .deviceType(req.getDeviceType())
                .brand(req.getBrand())
                .model(req.getModel())
                .condition(req.getCondition().name())
                .quantity(req.getQuantity())
                .imagePaths(req.getImagePaths() != null && !req.getImagePaths().isBlank()
                        ? req.getImagePaths().split(",")
                        : new String[0])
                .pickupAddress(req.getPickupAddress())
                .latitude(req.getLatitude())   // ✅ include
                .longitude(req.getLongitude()) // ✅ include
                .remarks(req.getRemarks())
                .status(req.getStatus().name())
                .createdAt(req.getCreatedAt() == null ? null : req.getCreatedAt().toString())
                .pickupDateTime(req.getPickupDateTime() == null ? null : req.getPickupDateTime().toString())
                .pickupPersonnel(req.getPickupPersonnel())
                .rejectionReason(req.getRejectionReason())
                .pickupTimeSlot(req.getPickupTimeSlot())



                // ✅ Map user details
                .userName(req.getUser().getName())
                .userEmail(req.getUser().getEmail())
                .userPhone(req.getUser().getPhone())

                .completedAt(req.getCompletedAt() != null
                        ? req.getCompletedAt().toString()
                        : null)
                .build();
    }

}
