package com.example.backend.service;

import com.example.backend.dto.stats.DonationCampaignStats;
import com.example.backend.dto.stats.DonationTotalStats;
import com.example.backend.dto.stats.HouseholdDonationStats;

import java.time.LocalDate;
import java.util.List;

public interface StatsService {
	HouseholdDonationStats getHouseholdDonationStatsByMonth(int month, int year);
	DonationTotalStats getDonationTotalByMonth(int month, int year);
	List<DonationCampaignStats> getDonationStatsByType(LocalDate startDate, LocalDate endDate);
}