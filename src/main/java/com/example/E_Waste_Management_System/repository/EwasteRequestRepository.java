package com.example.E_Waste_Management_System.repository;

import com.example.E_Waste_Management_System.Model.EwasteRequest;
import com.example.E_Waste_Management_System.Model.PickupPerson;
import com.example.E_Waste_Management_System.Model.Status;
import com.example.E_Waste_Management_System.Model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EwasteRequestRepository extends JpaRepository<EwasteRequest, Long> {
    List<EwasteRequest> findByUser(User user);
    List<EwasteRequest> findByStatus(Status status);
    Page<EwasteRequest> findAllByStatus(Status status, Pageable pageable);
    long countByStatus(Status status);
    List<EwasteRequest> findByPickupPerson(PickupPerson pickupPerson);

    // (Optional) If you only want "scheduled" requests for dashboard
    List<EwasteRequest> findByPickupPersonAndStatus(PickupPerson pickupPerson, Status status);
//    List<EwasteRequest> findByUserIdAndCreatedAtAfter(Long userId, LocalDateTime date);
    List<EwasteRequest> findByUserIdAndCreatedAtAfter(Long userId, LocalDateTime cutoff);
    List<EwasteRequest> findByCreatedAtAfter(LocalDateTime cutoff);
}


