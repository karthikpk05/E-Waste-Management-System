package com.example.E_Waste_Management_System.config;

import com.example.E_Waste_Management_System.Model.Admin;
import com.example.E_Waste_Management_System.Model.Role;
import com.example.E_Waste_Management_System.repository.AdminRepository;
import com.example.E_Waste_Management_System.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class AdminSeeder {

    private final AdminRepository adminRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedAdmin() {
        return args -> {
            Role adminRole = roleRepo.findByName("ROLE_ADMIN")
                    .orElseGet(() -> roleRepo.save(Role.builder().name("ROLE_ADMIN").build()));

            if (!adminRepo.existsByEmail("admin@example.com")) {
                Admin admin = Admin.builder()
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("admin123"))
                        .name("Default Admin")
                        .roles(Set.of(adminRole))   
                        .build();
                adminRepo.save(admin);
                System.out.println("✅ Default admin created: admin@example.com / admin123");
            } else {
                System.out.println("ℹ️ Admin already exists, skipping seeding.");
            }
        };
    }
}
