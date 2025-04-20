package com.example.backend.repository;

import com.example.backend.model.Revenue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevenueRepository extends JpaRepository<Revenue, String> {
	boolean existsById(String id);
}
