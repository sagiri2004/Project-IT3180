package com.example.backend.repository;

import com.example.backend.model.VehicleFeeConfig;
import com.example.backend.model.enums.TicketType;
import com.example.backend.model.enums.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleFeeConfigRepository extends JpaRepository<VehicleFeeConfig, Integer> {
    Optional<VehicleFeeConfig> findByVehicleTypeAndTicketType(VehicleType vehicleType, TicketType ticketType);
} 