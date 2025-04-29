package com.example.backend.repository;

import com.example.backend.model.Resident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResidentRepository extends JpaRepository<Resident, Integer> {
	List<Resident> findByHouseholdId(Integer householdId);
	Resident findByIdCardNumber(String idCardNumber);
}