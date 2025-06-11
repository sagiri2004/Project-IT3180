package com.example.backend.repository;

import com.example.backend.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    List<Vehicle> findByHouseholdId(Integer householdId);
    boolean existsByLicensePlate(String licensePlate);
    Page<Vehicle> findByHouseholdId(Long householdId, Pageable pageable);
} 