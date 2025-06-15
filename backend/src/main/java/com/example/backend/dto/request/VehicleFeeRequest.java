package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehicleFeeRequest {
    @NotNull(message = "Vehicle ID is required")
    private Integer vehicleId;

    @NotBlank(message = "Month year is required")
    private String monthYear;

    @NotBlank(message = "Ticket type is required")
    private String ticketType;

    private String day;
} 