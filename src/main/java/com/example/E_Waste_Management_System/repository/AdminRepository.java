package com.example.E_Waste_Management_System.repository;

import com.example.E_Waste_Management_System.Model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long>{

    boolean existsByEmail(String email);
    Optional<Admin> findByEmail(String email);
}
