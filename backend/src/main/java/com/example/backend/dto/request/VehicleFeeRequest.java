package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class VehicleFeeRequest {
    @NotNull(message = "Vehicle ID is required")
    private Integer vehicleId;

    @NotBlank(message = "Month year is required")
    private String monthYear;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
} 