package com.example.backend.repository;

import com.example.backend.model.VehicleFee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleFeeRepository extends JpaRepository<VehicleFee, Integer> {
    List<VehicleFee> findByVehicleId(Integer vehicleId);
    List<VehicleFee> findByVehicleIdAndMonthYear(Integer vehicleId, String monthYear);
    boolean existsByVehicleIdAndMonthYear(Integer vehicleId, String monthYear);
    Page<VehicleFee> findByVehicleId(Integer vehicleId, Pageable pageable);
    Page<VehicleFee> findByVehicleIdAndMonthYear(Integer vehicleId, String monthYear, Pageable pageable);
} 