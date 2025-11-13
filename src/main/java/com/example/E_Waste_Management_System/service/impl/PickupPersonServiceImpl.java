
package com.example.E_Waste_Management_System.service.impl;

import com.example.E_Waste_Management_System.Model.PickupPerson;
import com.example.E_Waste_Management_System.Model.Role;
import com.example.E_Waste_Management_System.repository.PickupPersonRepository;
import com.example.E_Waste_Management_System.repository.RoleRepository;
import com.example.E_Waste_Management_System.service.PickupPersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PickupPersonServiceImpl implements PickupPersonService {

    private final PickupPersonRepository pickupRepo;
    private final PasswordEncoder encoder;
    private final RoleRepository roleRepo;

//    @Override
//    public PickupPerson registerPickupPerson(PickupPerson pickup) {
//        if (pickupRepo.findByEmail(pickup.getEmail()).isPresent()) {
//            throw new RuntimeException("Email already in use");
//        }
//        pickup.setPassword(encoder.encode(pickup.getPassword()));
//        return pickupRepo.save(pickup);
//    }

    @Override
    public PickupPerson registerPickupPerson(PickupPerson pickup) {
        // ✅ Check if email is already in use
        if (pickupRepo.findByEmail(pickup.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        // ✅ Check if phone is already in use (optional, like user)
        if (pickup.getPhone() != null && pickupRepo.existsByPhone(pickup.getPhone())) {
            throw new RuntimeException("Phone already in use");
        }

        // ✅ Validate required fields
        if (pickup.getName() == null || pickup.getPassword() == null) {
            throw new RuntimeException("Name and password are required");
        }

        // ✅ Encode password
        pickup.setPassword(encoder.encode(pickup.getPassword()));

        Role pickupRole = roleRepo.findByName("ROLE_PICKUP")
                .orElseGet(() -> roleRepo.save(Role.builder().name("ROLE_PICKUP").build()));

        if (pickup.getRoles() == null) {
            pickup.setRoles(new HashSet<>());
        }

        pickup.getRoles().add(pickupRole);

        return pickupRepo.save(pickup);


//        // ✅ Assign ROLE_PICKUP
//        Role pickupRole = roleRepo.findByName("ROLE_PICKUP")
//                .orElseGet(() -> roleRepo.save(Role.builder().name("ROLE_PICKUP").build()));
//        pickup.setRoles(Set.of(pickupRole));
//
//
//        // ✅ Save pickup person
//        return pickupRepo.save(pickup);
    }


    @Override
    public List<PickupPerson> getAllPickupPersons() {
        return pickupRepo.findAll();
    }

    @Override
    public PickupPerson getPickupPersonById(Long id) {
        return pickupRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pickup person not found"));
    }
}
