package com.example.backend.dto.request;

import com.example.backend.model.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class VehicleRequest {
    @NotNull(message = "Household ID is required")
    private Integer householdId;

    @NotBlank(message = "License plate is required")
    private String licensePlate;

    @NotNull(message = "Vehicle type is required")
    private VehicleType type;

    private LocalDate registeredDate;
} 