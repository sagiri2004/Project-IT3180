package com.example.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.YearMonth;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeCollectionRequest {
	@NotNull(message = "Household ID is required")
	private Integer householdId;

	@NotNull(message = "Fee type ID is required")
	private Integer feeTypeId;

	@NotNull(message = "Year-month is required (format: YYYY-MM)")
	private YearMonth yearMonth;

	@NotNull(message = "Amount is required")
	@Min(value = 0, message = "Amount must be positive")
	private Double amount;

	private Boolean isPaid;

	private LocalDate paidDate;

	private String paidBy;

	private String collectedBy;
}