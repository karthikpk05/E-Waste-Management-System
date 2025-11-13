package com.example.E_Waste_Management_System.repository;

import com.example.E_Waste_Management_System.Model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);
}
