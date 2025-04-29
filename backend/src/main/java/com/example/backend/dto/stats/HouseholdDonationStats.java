package com.example.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdDonationStats {
	private int month;
	private int year;
	private int totalHouseholds;
	private int paidHouseholds;
	private int unpaidHouseholds;
	private double paidPercentage;
}