package com.example.backend.service.impl;

import com.example.backend.dto.request.DonationRequest;
import com.example.backend.dto.response.DonationResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Donation;
import com.example.backend.model.DonationCampaign;
import com.example.backend.model.Household;
import com.example.backend.repository.DonationCampaignRepository;
import com.example.backend.repository.DonationRepository;
import com.example.backend.repository.HouseholdRepository;
import com.example.backend.service.DonationService;
import com.example.backend.service.HistoryRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonationServiceImpl implements DonationService {

	private final DonationRepository donationRepository;
	private final HouseholdRepository householdRepository;
	private final DonationCampaignRepository donationCampaignRepository;
	private final HistoryRecordService historyRecordService;

	@Override
	@Transactional
	public DonationResponse createDonation(DonationRequest request) {
		// Validate household and campaign
		Household household = householdRepository.findById(request.getHouseholdId())
				.orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + request.getHouseholdId()));

		DonationCampaign campaign = donationCampaignRepository.findById(request.getDonationCampaignId())
				.orElseThrow(() -> new ResourceNotFoundException("Donation campaign not found with id: " + request.getDonationCampaignId()));

		// Check if campaign is active
		if (campaign.getEndDate() != null && campaign.getEndDate().isBefore(LocalDate.now())) {
			throw new BadRequestException("Cannot donate to a campaign that has ended");
		}

		// Use current date if not provided
		LocalDate donationDate = request.getDonationDate() != null ?
				request.getDonationDate() : LocalDate.now();

		Donation donation = Donation.builder()
				.household(household)
				.donationCampaign(campaign)
				.amount(request.getAmount())
				.donationDate(donationDate)
				.createdBy(getCurrentUsername())
				.build();

		donation = donationRepository.save(donation);

		// Record history
		historyRecordService.recordAction("Donation", donation.getId(), "CREATE");

		return mapToDonationResponse(donation);
	}

	@Override
	public DonationResponse getDonationById(Integer id) {
		return donationRepository.findById(id)
				.map(this::mapToDonationResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));
	}

	@Override
	public Page<DonationResponse> getAllDonations(Pageable pageable) {
		return donationRepository.findAll(pageable)
				.map(this::mapToDonationResponse);
	}

	@Override
	public List<DonationResponse> getDonationsByHousehold(Integer householdId) {
		if (!householdRepository.existsById(householdId)) {
			throw new ResourceNotFoundException("Household not found with id: " + householdId);
		}

		return donationRepository.findByHouseholdId(householdId).stream()
				.map(this::mapToDonationResponse)
				.collect(Collectors.toList());
	}

	@Override
	public List<DonationResponse> getDonationsByCampaign(Integer campaignId) {
		if (!donationCampaignRepository.existsById(campaignId)) {
			throw new ResourceNotFoundException("Donation campaign not found with id: " + campaignId);
		}

		return donationRepository.findByDonationCampaignId(campaignId).stream()
				.map(this::mapToDonationResponse)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public DonationResponse updateDonation(Integer id, DonationRequest request) {
		Donation donation = donationRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));

		// Store old values for history
		String oldValues = "Amount: " + donation.getAmount() +
				", DonationDate: " + donation.getDonationDate();

		// Can only update amount and donation date
		donation.setAmount(request.getAmount());

		if (request.getDonationDate() != null) {
			donation.setDonationDate(request.getDonationDate());
		}

		donation = donationRepository.save(donation);

		// Record history
		historyRecordService.recordAction("Donation", donation.getId(), "UPDATE");

		return mapToDonationResponse(donation);
	}

	@Override
	@Transactional
	public void deleteDonation(Integer id) {
		Donation donation = donationRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));

		donationRepository.deleteById(id);

		// Record history
		historyRecordService.recordAction("Donation", id, "DELETE");
	}

	private DonationResponse mapToDonationResponse(Donation donation) {
		Household household = donation.getHousehold();
		DonationCampaign campaign = donation.getDonationCampaign();

		return DonationResponse.builder()
				.id(donation.getId())
				.householdId(household.getId())
				.householdCode(household.getHouseholdCode())
				.apartmentNumber(household.getApartmentNumber())
				.donationCampaignId(campaign.getId())
				.campaignName(campaign.getName())
				.amount(donation.getAmount())
				.donationDate(donation.getDonationDate())
				.createdBy(donation.getCreatedBy())
				.createdAt(donation.getCreatedAt())
				.build();
	}

	private String getCurrentUsername() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return "system";
		}
		return authentication.getName();
	}
}