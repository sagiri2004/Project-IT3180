package com.example.backend.dto.request;

import com.example.backend.model.enums.UtilityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class UtilityBillRequest {
    @NotNull(message = "Household ID is required")
    private Integer householdId;

    @NotBlank(message = "Month year is required")
    private String monthYear;

    @NotNull(message = "Utility type is required")
    private UtilityType type;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
} 