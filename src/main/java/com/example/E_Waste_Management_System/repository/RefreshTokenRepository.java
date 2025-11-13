package com.example.E_Waste_Management_System.repository;


import com.example.E_Waste_Management_System.Model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);
    void deleteBySubjectEmail(String email);
}
