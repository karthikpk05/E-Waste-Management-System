package com.example.E_Waste_Management_System.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {

    private String name;
    private String phone;
    private String pickupAddress;

    private Double pickupLatitude;
    private Double pickupLongitude;

    private String profilePicture;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}
