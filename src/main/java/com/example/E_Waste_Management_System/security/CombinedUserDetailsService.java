//package com.example.E_Waste_Management_System.security;
//
//import com.example.E_Waste_Management_System.Model.Admin;
//import com.example.E_Waste_Management_System.Model.User;
//import com.example.E_Waste_Management_System.repository.AdminRepository;
//import com.example.E_Waste_Management_System.repository.PickupPersonRepository;
//import com.example.E_Waste_Management_System.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.*;
//import org.springframework.stereotype.Service;
//
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class CombinedUserDetailsService implements UserDetailsService {
//
//    private final AdminRepository adminRepo;
//    private final UserRepository userRepo;
//    private final PickupPersonRepository pickupPersonRepo;
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        // Prefer admin if email overlaps
//        Admin admin = adminRepo.findByEmail(email).orElse(null);
//        if (admin != null) {
//            var authorities = admin.getRoles().stream()
//                    .map(r -> new SimpleGrantedAuthority(r.getName()))
//                    .collect(Collectors.toList());
//            return new org.springframework.security.core.userdetails.User(
//                    admin.getEmail(), admin.getPassword(), authorities);
//        }
//
//        User user = userRepo.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//        var authorities = user.getRoles().stream()
//                .map(r -> new SimpleGrantedAuthority(r.getName()))
//                .collect(Collectors.toList());
//        return new org.springframework.security.core.userdetails.User(
//                user.getEmail(), user.getPassword(), authorities);
//
//
//    }
//
//
//}

package com.example.E_Waste_Management_System.security;

import com.example.E_Waste_Management_System.Model.Admin;
import com.example.E_Waste_Management_System.Model.PickupPerson;
import com.example.E_Waste_Management_System.Model.User;
import com.example.E_Waste_Management_System.repository.AdminRepository;
import com.example.E_Waste_Management_System.repository.PickupPersonRepository;
import com.example.E_Waste_Management_System.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CombinedUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepo;
    private final UserRepository userRepo;
    private final PickupPersonRepository pickupPersonRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 🔹 First check if it's an admin
        Admin admin = adminRepo.findByEmail(email).orElse(null);
        if (admin != null) {
            // If Admin has roles in DB
            if (admin.getRoles() != null && !admin.getRoles().isEmpty()) {
                var authorities = admin.getRoles().stream()
                        .map(r -> new SimpleGrantedAuthority(r.getName()))
                        .collect(Collectors.toList());
                return new org.springframework.security.core.userdetails.User(
                        admin.getEmail(), admin.getPassword(), authorities);
            }
            // Fallback if no roles table
            return new org.springframework.security.core.userdetails.User(
                    admin.getEmail(), admin.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
        }

        // 🔹 Next check if it's a regular user
        User user = userRepo.findByEmail(email).orElse(null);
        if (user != null) {
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                var authorities = user.getRoles().stream()
                        .map(r -> new SimpleGrantedAuthority(r.getName()))
                        .collect(Collectors.toList());
                return new org.springframework.security.core.userdetails.User(
                        user.getEmail(), user.getPassword(), authorities);
            }
            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(), user.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        }

        // 🔹 Finally check if it's a pickup person
        PickupPerson pickupPerson = pickupPersonRepo.findByEmail(email).orElse(null);
        if (pickupPerson != null) {
            return new org.springframework.security.core.userdetails.User(
                    pickupPerson.getEmail(), pickupPerson.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_PICKUP")));
        }

        // 🔹 If no match found
        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}

