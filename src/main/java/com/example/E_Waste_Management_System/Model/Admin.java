package com.example.E_Waste_Management_System.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "admins")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Admin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length=120)
    private String name;

    @Column(unique = true, nullable = false, length=120)
    private String email;

    @Column(nullable = false)
    private String password; // BCrypt

    @Column(length=120)
    private String department; // optional

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "admin_roles",
            joinColumns = @JoinColumn(name="admin_id"),
            inverseJoinColumns = @JoinColumn(name="role_id"))
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
}
