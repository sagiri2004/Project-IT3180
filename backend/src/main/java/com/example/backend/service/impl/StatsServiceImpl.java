package com.example.backend.service.impl;

import com.example.backend.dto.stats.DonationCampaignStats;
import com.example.backend.dto.stats.DonationTotalStats;
import com.example.backend.dto.stats.HouseholdDonationStats;
import com.example.backend.model.Donation;
import com.example.backend.model.DonationCampaign;
import com.example.backend.model.Household;
import com.example.backend.repository.DonationCampaignRepository;
import com.example.backend.repository.DonationRepository;
import com.example.backend.repository.HouseholdRepository;
import com.example.backend.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

	private final DonationRepository donationRepository;
	private final HouseholdRepository householdRepository;
	private final DonationCampaignRepository donationCampaignRepository;

	@Override
	public HouseholdDonationStats getHouseholdDonationStatsByMonth(int month, int year) {
		// Get all households
		List<Household> allHouseholds = householdRepository.findAll();
		int totalHouseholds = allHouseholds.size();

		// Find donations for the specified month/year
		LocalDate startDate = YearMonth.of(year, month).atDay(1);
		LocalDate endDate = YearMonth.of(year, month).atEndOfMonth();

		// Find households that have made donations in this period
		List<Integer> paidHouseholdIds = donationRepository.findByDonationDateBetween(startDate, endDate)
				.stream()
				.map(donation -> donation.getHousehold().getId())
				.distinct()
				.collect(Collectors.toList());

		int paidHouseholds = paidHouseholdIds.size();
		int unpaidHouseholds = totalHouseholds - paidHouseholds;
		double paidPercentage = totalHouseholds > 0 ? (double) paidHouseholds / totalHouseholds * 100 : 0;

		return HouseholdDonationStats.builder()
				.month(month)
				.year(year)
				.totalHouseholds(totalHouseholds)
				.paidHouseholds(paidHouseholds)
				.unpaidHouseholds(unpaidHouseholds)
				.paidPercentage(paidPercentage)
				.build();
	}

	@Override
	public DonationTotalStats getDonationTotalByMonth(int month, int year) {
		LocalDate startDate = YearMonth.of(year, month).atDay(1);
		LocalDate endDate = YearMonth.of(year, month).atEndOfMonth();

		List<Donation> donations = donationRepository.findByDonationDateBetween(startDate, endDate);

		if (donations.isEmpty()) {
			return DonationTotalStats.builder()
					.month(month)
					.year(year)
					.totalAmount(0)
					.averageAmount(0)
					.highestDonation(0)
					.lowestDonation(0)
					.donationCount(0)
					.build();
		}

		double totalAmount = donations.stream()
				.mapToDouble(Donation::getAmount)
				.sum();

		double highestDonation = donations.stream()
				.mapToDouble(Donation::getAmount)
				.max()
				.orElse(0);

		double lowestDonation = donations.stream()
				.mapToDouble(Donation::getAmount)
				.min()
				.orElse(0);

		int donationCount = donations.size();
		double averageAmount = totalAmount / donationCount;

		return DonationTotalStats.builder()
				.month(month)
				.year(year)
				.totalAmount(totalAmount)
				.averageAmount(averageAmount)
				.highestDonation(highestDonation)
				.lowestDonation(lowestDonation)
				.donationCount(donationCount)
				.build();
	}

	@Override
	public List<DonationCampaignStats> getDonationStatsByType(LocalDate startDate, LocalDate endDate) {
		// Get all campaigns
		List<DonationCampaign> allCampaigns = donationCampaignRepository.findAll();

		// Get donations in the date range
		List<Donation> donations = donationRepository.findByDonationDateBetween(startDate, endDate);

		// Calculate total amount of all donations in the period
		double totalDonationsAmount = donations.stream()
				.mapToDouble(Donation::getAmount)
				.sum();

		// Group donations by campaign
		Map<Integer, List<Donation>> donationsByCampaign = donations.stream()
				.collect(Collectors.groupingBy(d -> d.getDonationCampaign().getId()));

		List<DonationCampaignStats> statsList = new ArrayList<>();

		for (DonationCampaign campaign : allCampaigns) {
			List<Donation> campaignDonations = donationsByCampaign.getOrDefault(campaign.getId(), new ArrayList<>());

			double campaignTotal = campaignDonations.stream()
					.mapToDouble(Donation::getAmount)
					.sum();

			double percentage = totalDonationsAmount > 0 ? (campaignTotal / totalDonationsAmount) * 100 : 0;

			DonationCampaignStats stats = DonationCampaignStats.builder()
					.campaignId(campaign.getId())
					.campaignName(campaign.getName())
					.totalAmount(campaignTotal)
					.donationCount(campaignDonations.size())
					.startDate(campaign.getStartDate())
					.endDate(campaign.getEndDate())
					.percentage(percentage)
					.build();

			statsList.add(stats);
		}

		return statsList;
	}
}