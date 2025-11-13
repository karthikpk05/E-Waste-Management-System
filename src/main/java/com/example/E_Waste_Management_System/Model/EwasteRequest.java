package com.example.E_Waste_Management_System.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ewaste_requests")
@Data
@Builder
public class EwasteRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String deviceType;
    private String brand;
    private String model;

    @Enumerated(EnumType.STRING)
    @Column(name = "device_condition")
    private Condition condition;

    private int quantity;

    @Column(columnDefinition = "TEXT")
    private String imagePaths; // comma-separated filenames

    private String pickupAddress;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;



    @Column(length = 500)
    private String remarks;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private LocalDateTime createdAt;

    // Milestone 3 fields:
    private LocalDateTime pickupDateTime;            // actual scheduled datetime (nullable)
    private String pickupPersonnel;                  // who will pickup (nullable)
    private String rejectionReason;                  // rejection reason (nullable)
    private String pickupTimeSlot;                   // user chosen slot e.g. "6-11", "11-3", "3-7"

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    @ManyToOne
    @JoinColumn(name = "pickup_person_id")
    private PickupPerson pickupPerson;



    @Column(name = "otp")
    private String otp;

    @Column(name = "otp_generated_at")
    private LocalDateTime otpGeneratedAt;

    private LocalDateTime completedAt;

    public Long getRequestId() {
        return requestId;
    }

    public PickupPerson getPickupPerson() {
        return pickupPerson;
    }

    public void setPickupPerson(PickupPerson pickupPerson) {
        this.pickupPerson = pickupPerson;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public EwasteRequest() {
    }


    public EwasteRequest(Long requestId, User user, String deviceType, String brand, String model, Condition condition, int quantity, String imagePaths, String pickupAddress, String remarks, Status status, LocalDateTime createdAt) {
        this.requestId = requestId;
        this.user = user;
        this.deviceType = deviceType;
        this.brand = brand;
        this.model = model;
        this.condition = condition;
        this.quantity = quantity;
        this.imagePaths = imagePaths;
        this.pickupAddress = pickupAddress;
        this.remarks = remarks;
        this.status = status;
        this.createdAt = createdAt;
    }

    public EwasteRequest(Long requestId, User user, String deviceType, String brand, String model, Condition condition, int quantity, String imagePaths, String pickupAddress, String remarks, Status status, LocalDateTime createdAt, LocalDateTime pickupDateTime, String pickupPersonnel, String rejectionReason, String pickupTimeSlot) {
        this.requestId = requestId;
        this.user = user;
        this.deviceType = deviceType;
        this.brand = brand;
        this.model = model;
        this.condition = condition;
        this.quantity = quantity;
        this.imagePaths = imagePaths;
        this.pickupAddress = pickupAddress;
        this.remarks = remarks;
        this.status = status;
        this.createdAt = createdAt;
        this.pickupDateTime = pickupDateTime;
        this.pickupPersonnel = pickupPersonnel;
        this.rejectionReason = rejectionReason;
        this.pickupTimeSlot = pickupTimeSlot;
    }

    public EwasteRequest(Long requestId, User user, String deviceType, String brand, String model, Condition condition, int quantity, String imagePaths, String pickupAddress, String remarks, Status status, LocalDateTime createdAt, LocalDateTime pickupDateTime, String pickupPersonnel, String rejectionReason, String pickupTimeSlot, PickupPerson pickupPerson, String otp, LocalDateTime otpGeneratedAt) {
        this.requestId = requestId;
        this.user = user;
        this.deviceType = deviceType;
        this.brand = brand;
        this.model = model;
        this.condition = condition;
        this.quantity = quantity;
        this.imagePaths = imagePaths;
        this.pickupAddress = pickupAddress;
        this.remarks = remarks;
        this.status = status;
        this.createdAt = createdAt;
        this.pickupDateTime = pickupDateTime;
        this.pickupPersonnel = pickupPersonnel;
        this.rejectionReason = rejectionReason;
        this.pickupTimeSlot = pickupTimeSlot;
        this.pickupPerson = pickupPerson;
        this.otp = otp;
        this.otpGeneratedAt = otpGeneratedAt;
    }

    public EwasteRequest(Long requestId, User user, String deviceType, String brand, String model, Condition condition, int quantity, String imagePaths, String pickupAddress, Double latitude, Double longitude, String remarks, Status status, LocalDateTime createdAt, LocalDateTime pickupDateTime, String pickupPersonnel, String rejectionReason, String pickupTimeSlot, PickupPerson pickupPerson, String otp, LocalDateTime otpGeneratedAt) {
        this.requestId = requestId;
        this.user = user;
        this.deviceType = deviceType;
        this.brand = brand;
        this.model = model;
        this.condition = condition;
        this.quantity = quantity;
        this.imagePaths = imagePaths;
        this.pickupAddress = pickupAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.remarks = remarks;
        this.status = status;
        this.createdAt = createdAt;
        this.pickupDateTime = pickupDateTime;
        this.pickupPersonnel = pickupPersonnel;
        this.rejectionReason = rejectionReason;
        this.pickupTimeSlot = pickupTimeSlot;
        this.pickupPerson = pickupPerson;
        this.otp = otp;
        this.otpGeneratedAt = otpGeneratedAt;
    }

    public EwasteRequest(Long requestId, User user, String deviceType, String brand, String model, Condition condition, int quantity, String imagePaths, String pickupAddress, Double latitude, Double longitude, String remarks, Status status, LocalDateTime createdAt, LocalDateTime pickupDateTime, String pickupPersonnel, String rejectionReason, String pickupTimeSlot, PickupPerson pickupPerson, String otp, LocalDateTime otpGeneratedAt, LocalDateTime completedAt) {
        this.requestId = requestId;
        this.user = user;
        this.deviceType = deviceType;
        this.brand = brand;
        this.model = model;
        this.condition = condition;
        this.quantity = quantity;
        this.imagePaths = imagePaths;
        this.pickupAddress = pickupAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.remarks = remarks;
        this.status = status;
        this.createdAt = createdAt;
        this.pickupDateTime = pickupDateTime;
        this.pickupPersonnel = pickupPersonnel;
        this.rejectionReason = rejectionReason;
        this.pickupTimeSlot = pickupTimeSlot;
        this.pickupPerson = pickupPerson;
        this.otp = otp;
        this.otpGeneratedAt = otpGeneratedAt;
        this.completedAt = completedAt;
    }
}