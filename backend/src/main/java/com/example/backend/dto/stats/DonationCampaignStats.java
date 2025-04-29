package com.example.backend.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationCampaignStats {
	private Integer campaignId;
	private String campaignName;
	private double totalAmount;
	private int donationCount;
	private LocalDate startDate;
	private LocalDate endDate;
	private double percentage;
}