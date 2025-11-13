package com.example.E_Waste_Management_System.service.impl;

import com.example.E_Waste_Management_System.Model.*;
import com.example.E_Waste_Management_System.dto.AuthResponse;
import com.example.E_Waste_Management_System.dto.LoginRequest;
import com.example.E_Waste_Management_System.dto.RefreshTokenRequest;
import com.example.E_Waste_Management_System.dto.RegisterRequest;
import com.example.E_Waste_Management_System.repository.*;
import com.example.E_Waste_Management_System.service.AuthService;
import com.example.E_Waste_Management_System.service.NotificationService;
import com.example.E_Waste_Management_System.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepo;
    private final AdminRepository adminRepo;
    private final RoleRepository roleRepo;
    private final RefreshTokenRepository refreshRepo;
    private final PickupPersonRepository pickupPersonRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwt;
    private final NotificationService notificationService;
    // at top of AuthServiceImpl

//    private final NotificationService notificationService;



    @Override
    public String registerUser(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) return "Email already in use";
        if (userRepo.existsByPhone(req.getPhone())) return "Phone already in use";

        Role userRole = roleRepo.findByName("ROLE_USER")
                .orElseGet(() -> roleRepo.save(Role.builder().name("ROLE_USER").build()));

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .password(encoder.encode(req.getPassword()))
                .pickupAddress(req.getPickupAddress())
                .pickupLatitude(req.getPickupLatitude())    // ✅ ADD
                .pickupLongitude(req.getPickupLongitude())
                .roles(Set.of(userRole))
                .build();



        // inside registerUser after userRepo.save(user);
        userRepo.save(user);

        // send welcome email
        notificationService.sendWelcomeEmail(user);


        return "User registered successfully";
    }

    @Override
    public AuthResponse loginUser(LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        // Reject if admin tries user login
        adminRepo.findByEmail(req.getEmail())
                .ifPresent(a -> { throw new BadCredentialsException("Use admin login"); });

        // ✅ Fetch user details
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String access = jwt.generateAccessToken(req.getEmail(), "USER");
        String refresh = createRefresh(req.getEmail(), "USER");

        return new AuthResponse(
                "User login success",
                access,
                refresh,
                "USER",
                user.getName(),
                user.getEmail(),
                user.getProfilePicture()
        );
    }

    @Override
    public AuthResponse loginPickup(LoginRequest req) {
        // Check if pickup person exists with this email
        PickupPerson pickupPerson = pickupPersonRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid pickup credentials"));

        // Verify password
        if (!encoder.matches(req.getPassword(), pickupPerson.getPassword())) {
            throw new BadCredentialsException("Invalid pickup credentials");
        }

        String access = jwt.generateAccessToken(req.getEmail(), "PICKUP");
        String refresh = createRefresh(req.getEmail(), "PICKUP");

        return new AuthResponse(
                "Pickup person login success",
                access,
                refresh,
                "PICKUP",
                pickupPerson.getName(),
                pickupPerson.getEmail(),
                null
        );
    }

    @Override
    public AuthResponse loginAdmin(LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        Admin admin = adminRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Not an admin"));

        String access = jwt.generateAccessToken(req.getEmail(), "ADMIN");
        String refresh = createRefresh(req.getEmail(), "ADMIN");

        return new AuthResponse(
                "Admin login success",
                access,
                refresh,
                "ADMIN",
                admin.getName(),
                admin.getEmail(),
                null // if you don’t store profilePicture for admin
        );
    }



    @Override
    public AuthResponse refresh(RefreshTokenRequest request) {
        RefreshToken rt = refreshRepo.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        if (rt.isRevoked() || rt.getExpiry().isBefore(Instant.now()))
            throw new RuntimeException("Refresh token expired or revoked");

        String newAccess = jwt.generateAccessToken(rt.getSubjectEmail(), rt.getSubjectType());
        String newRefresh = rotateRefresh(rt);
        return new AuthResponse("Token refreshed", newAccess, newRefresh, rt.getSubjectType());
    }

    @Override
    public void logout(String email) {
        refreshRepo.deleteBySubjectEmail(email); // revoke all refresh tokens
    }

    private String createRefresh(String email, String principalType) {
        RefreshToken rt = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .subjectEmail(email)
                .subjectType(principalType)
                .expiry(Instant.now().plusMillis(jwt.getRefreshExpirationMs()))
                .revoked(false)
                .build();
        refreshRepo.save(rt);
        return rt.getToken();
    }

    private String rotateRefresh(RefreshToken old) {
        old.setRevoked(true);
        refreshRepo.save(old);
        RefreshToken fresh = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .subjectEmail(old.getSubjectEmail())
                .subjectType(old.getSubjectType())
                .expiry(Instant.now().plusMillis(jwt.getRefreshExpirationMs()))
                .revoked(false)
                .build();
        refreshRepo.save(fresh);
        return fresh.getToken();
    }



}
