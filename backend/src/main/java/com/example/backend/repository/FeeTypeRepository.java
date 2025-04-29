package com.example.backend.repository;

import com.example.backend.model.FeeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeTypeRepository extends JpaRepository<FeeType, Integer> {
	Optional<FeeType> findByName(String name);
	List<FeeType> findByIsRequired(Boolean isRequired);
}