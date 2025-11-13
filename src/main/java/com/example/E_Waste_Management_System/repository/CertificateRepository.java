package com.example.E_Waste_Management_System.repository;

import com.example.E_Waste_Management_System.Model.Certificate;
import com.example.E_Waste_Management_System.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByUserOrderByIssuedAtDesc(User user);
    long countByUser(User user);
}