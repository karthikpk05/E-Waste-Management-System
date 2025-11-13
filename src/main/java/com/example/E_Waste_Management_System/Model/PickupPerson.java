package com.example.E_Waste_Management_System.Model;

import jakarta.persistence.*;
        import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PickupPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Uncommented name field - this was causing issues
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    // credentials for login
    @Column(unique = true, nullable = false)
    private String username;

    private String password;  // store encoded password if using Spring Security

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "pickup_roles",
            joinColumns = @JoinColumn(name = "pickup_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
}