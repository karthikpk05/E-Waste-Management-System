package com.example.E_Waste_Management_System.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length=120)
    private String name;

    @Column(unique = true, nullable = false, length=120)
    private String email;

    @Column(unique = true, nullable = false, length=20)
    private String phone;

    @Column(nullable = false)
    private String password; // BCrypt

    @Column(length=255)
    private String pickupAddress;

    @Column(name = "pickup_latitude")
    private Double pickupLatitude;

    @Column(name = "pickup_longitude")
    private Double pickupLongitude;

    @Column(length=255)
    private String profilePicture;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name="user_id"),
            inverseJoinColumns = @JoinColumn(name="role_id"))
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
}
