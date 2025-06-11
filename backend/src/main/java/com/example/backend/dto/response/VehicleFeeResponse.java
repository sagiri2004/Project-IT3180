package com.example.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class VehicleFeeResponse {
    private Integer id;
    private Integer vehicleId;
    private String monthYear;
    private Double amount;
    private Boolean isPaid;
    private LocalDate paidDate;
    private String paidBy;
    private String collectedBy;
    private String createdBy;
    private LocalDateTime createdAt;
} 