package com.example.E_Waste_Management_System.service;


import com.example.E_Waste_Management_System.Model.Admin;
import com.example.E_Waste_Management_System.Model.PickupPerson;
import com.example.E_Waste_Management_System.Model.Role;
import com.example.E_Waste_Management_System.repository.AdminRepository;
import com.example.E_Waste_Management_System.repository.PickupPersonRepository;
import com.example.E_Waste_Management_System.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepo;
    private final PickupPersonRepository pickupPersonRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public Admin login(String email, String password) {
        Admin admin = adminRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return admin;
    }


    public PickupPerson registerPickupPerson(PickupPerson person) {
        // ✅ Validate required fields
        if (person.getUsername() == null || person.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (person.getName() == null || person.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (person.getEmail() == null || person.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (person.getPassword() == null || person.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        if (person.getPhone() == null || person.getPhone().trim().isEmpty()) {
            throw new RuntimeException("Phone is required");
        }

        // ✅ Check if username or email already exists
        if (pickupPersonRepo.existsByUsername(person.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (pickupPersonRepo.existsByEmail(person.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // ✅ Encode password
        String rawPassword = person.getPassword(); // keep raw for email
        person.setPassword(passwordEncoder.encode(rawPassword));

        // ✅ Assign pickup role
        Role pickupRole = roleRepo.findByName("ROLE_PICKUP")
                .orElseGet(() -> roleRepo.save(Role.builder().name("ROLE_PICKUP").build()));
        person.setRoles(Set.of(pickupRole));

        // ✅ Save person
        PickupPerson savedPerson = pickupPersonRepo.save(person);

        // ✅ Send email with raw password
        notificationService.sendPickupPersonWelcomeEmail(savedPerson, rawPassword);

        return savedPerson;
    }


//
//    public PickupPerson registerPickupPerson(PickupPerson pickupPerson) {
//
//        if(pickupPersonRepository.existsByPhone(pickupPerson.getPhone())) {
//            throw new RuntimeException("Phone number already registered");
//        }
//
//        // Encode password
//        pickupPerson.setPassword(passwordEncoder.encode(pickupPerson.getPassword()));
//
//        // Fetch Pickup Role
//        Role pickupRole = roleRepository.findByName("PICKUP_PERSON")
//                .orElseThrow(() -> new RuntimeException("Pickup role not found"));
//
//        // Assign role
//        pickupPerson.getRoles().add(pickupRole);
//
//        // Save and return
//        return pickupPersonRepository.save(pickupPerson);
//    }
}
