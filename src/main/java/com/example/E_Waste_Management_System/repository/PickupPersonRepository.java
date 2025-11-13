package com.example.E_Waste_Management_System.repository;

import com.example.E_Waste_Management_System.Model.PickupPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PickupPersonRepository extends JpaRepository<PickupPerson, Long> {

    // Check if username already exists
    boolean existsByUsername(String username);

    boolean existsByPhone(String phone);

    // Check if email already exists
    boolean existsByEmail(String email);

    // Find by username (for login purposes)
    Optional<PickupPerson> findByUsername(String username);

    // Find by email (for login purposes)
    Optional<PickupPerson> findByEmail(String email);
}