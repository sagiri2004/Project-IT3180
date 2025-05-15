package com.example.backend.repository;

import com.example.backend.model.PopulationChange;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PopulationChangeRepository extends JpaRepository<PopulationChange, Integer> {
	List<PopulationChange> findByHouseholdId(Integer householdId);
	List<PopulationChange> findByResidentId(Integer residentId);
	List<PopulationChange> findByIsApproved(Boolean isApproved);
	Page<PopulationChange> findByIsApproved(Boolean isApproved, Pageable pageable);
}