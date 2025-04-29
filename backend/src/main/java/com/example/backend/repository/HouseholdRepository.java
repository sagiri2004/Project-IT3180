package com.example.backend.repository;

import com.example.backend.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HouseholdRepository extends JpaRepository<Household, Integer> {
	Household findByHouseholdCode(String householdCode);
	List<Household> findByHouseholdCodeContainingIgnoreCaseOrApartmentNumberContainingIgnoreCaseOrOwnerNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
			String householdCode, String apartmentNumber, String ownerName, String address);

}