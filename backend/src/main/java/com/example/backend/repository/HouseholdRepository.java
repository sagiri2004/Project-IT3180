package com.example.backend.repository;

import com.example.backend.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HouseholdRepository extends JpaRepository<Household, Integer> {
	Household findByHouseholdCode(String householdCode);

	@Query("SELECT h FROM Household h WHERE " +
			"LOWER(h.householdCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
			"LOWER(h.apartmentNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
			"LOWER(h.ownerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
			"LOWER(h.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
	List<Household> searchHouseholds(@Param("keyword") String keyword);
}