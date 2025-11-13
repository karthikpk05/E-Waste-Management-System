package com.example.E_Waste_Management_System.service;

import com.example.E_Waste_Management_System.Model.PickupPerson;

import java.util.List;

public interface PickupPersonService {
    PickupPerson registerPickupPerson(PickupPerson pickup);
    List<PickupPerson> getAllPickupPersons();
    PickupPerson getPickupPersonById(Long id);
}
