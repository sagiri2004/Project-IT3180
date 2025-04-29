package com.example.backend.repository;

import com.example.backend.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HouseholdRepository extends JpaRepository<Household, Integer> {
	Household findByHouseholdCode(String householdCode);
}