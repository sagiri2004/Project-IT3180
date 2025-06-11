package com.example.backend.dto.response;

import com.example.backend.model.enums.UtilityType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class UtilityBillResponse {
    private Integer id;
    private Integer householdId;
    private String monthYear;
    private UtilityType type;
    private Double amount;
    private Boolean isPaid;
    private LocalDate paidDate;
    private String paidBy;
    private String collectedBy;
    private String createdBy;
    private LocalDateTime createdAt;
} 