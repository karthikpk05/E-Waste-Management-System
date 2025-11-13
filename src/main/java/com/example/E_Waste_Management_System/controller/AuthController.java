package com.example.E_Waste_Management_System.controller;


import com.example.E_Waste_Management_System.dto.AuthResponse;
import com.example.E_Waste_Management_System.dto.LoginRequest;
import com.example.E_Waste_Management_System.dto.RefreshTokenRequest;
import com.example.E_Waste_Management_System.dto.RegisterRequest;
import com.example.E_Waste_Management_System.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService auth;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(auth.registerUser(request));
    }

    @PostMapping("/login/user")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(auth.loginUser(request));
    }

    @PostMapping("/login/admin")
    public ResponseEntity<AuthResponse> loginAdmin(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(auth.loginAdmin(request));
    }

    // Added pickup person login endpoint
    @PostMapping("/login/pickup")
    public ResponseEntity<AuthResponse> loginPickup(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(auth.loginPickup(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(auth.refresh(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody String email) {
        auth.logout(email);
        return ResponseEntity.ok("Logged out");
    }
}


//import com.example.E_Waste_Management_System.dto.AuthResponse;
//import com.example.E_Waste_Management_System.dto.LoginRequest;
//import com.example.E_Waste_Management_System.dto.RefreshTokenRequest;
//import com.example.E_Waste_Management_System.dto.RegisterRequest;
//import com.example.E_Waste_Management_System.service.AuthService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/auth")
//@RequiredArgsConstructor
//public class AuthController {
//
//    private final AuthService auth;
//
//    @PostMapping("/register")
//    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
//        return ResponseEntity.ok(auth.registerUser(request));
//    }
//
//    @PostMapping("/login/user")
//    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest request) {
//        return ResponseEntity.ok(auth.loginUser(request));
//    }
//
//    @PostMapping("/login/admin")
//    public ResponseEntity<AuthResponse> loginAdmin(@RequestBody LoginRequest request) {
//        return ResponseEntity.ok(auth.loginAdmin(request));
//    }
//
//    @PostMapping("/refresh")
//    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
//        return ResponseEntity.ok(auth.refresh(request));
//    }
//
//    @PostMapping("/logout")
//    public ResponseEntity<String> logout(@RequestBody String email) {
//        auth.logout(email);
//        return ResponseEntity.ok("Logged out");
//    }
//}
