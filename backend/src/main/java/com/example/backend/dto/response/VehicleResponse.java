package com.example.backend.dto.response;

import com.example.backend.model.enums.VehicleType;
import jdk.jshell.Snippet;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class VehicleResponse {
    private Integer id;
    private Integer householdId;
    private String licensePlate;
    private VehicleType type;
    private LocalDate registeredDate;
    private Boolean isActive;
    private String createdBy;
    private LocalDateTime createdAt;
} 