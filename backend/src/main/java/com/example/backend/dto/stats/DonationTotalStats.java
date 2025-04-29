package com.example.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationTotalStats {
	private int month;
	private int year;
	private double totalAmount;
	private double averageAmount;
	private double highestDonation;
	private double lowestDonation;
	private int donationCount;
}