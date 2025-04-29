package com.example.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationRequest {
	@NotNull(message = "Household ID is required")
	private Integer householdId;

	@NotNull(message = "Donation campaign ID is required")
	private Integer donationCampaignId;

	@NotNull(message = "Amount is required")
	@Min(value = 0, message = "Amount must be positive")
	private Double amount;

	private LocalDate donationDate;
}