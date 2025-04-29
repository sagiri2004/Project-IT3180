package com.example.backend.service.impl;

import com.example.backend.dto.request.DonationCampaignRequest;
import com.example.backend.dto.response.DonationCampaignResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.DonationCampaign;
import com.example.backend.repository.DonationCampaignRepository;
import com.example.backend.repository.DonationRepository;
import com.example.backend.service.DonationCampaignService;
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
public class DonationCampaignServiceImpl implements DonationCampaignService {

	private final DonationCampaignRepository donationCampaignRepository;
	private final DonationRepository donationRepository;
	private final HistoryRecordService historyRecordService;

	@Override
	@Transactional
	public DonationCampaignResponse createDonationCampaign(DonationCampaignRequest request) {
		// Validate dates
		if (request.getEndDate() != null && request.getStartDate().isAfter(request.getEndDate())) {
			throw new BadRequestException("Start date must be before end date");
		}

		DonationCampaign campaign = DonationCampaign.builder()
				.name(request.getName())
				.description(request.getDescription())
				.startDate(request.getStartDate())
				.endDate(request.getEndDate())
				.targetAmount(request.getTargetAmount())
				.createdBy(getCurrentUsername())
				.build();

		campaign = donationCampaignRepository.save(campaign);

		// Record history
		historyRecordService.recordAction(
				"DonationCampaign",
				campaign.getId(),
				"CREATE",
				"Created donation campaign: " + campaign.getName(),
				getCurrentUsername()
		);

		return mapToDonationCampaignResponse(campaign);
	}

	@Override
	public DonationCampaignResponse getDonationCampaignById(Integer id) {
		return donationCampaignRepository.findById(id)
				.map(this::mapToDonationCampaignResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Donation campaign not found with id: " + id));
	}

	@Override
	public Page<DonationCampaignResponse> getAllDonationCampaigns(Pageable pageable) {
		return donationCampaignRepository.findAll(pageable)
				.map(this::mapToDonationCampaignResponse);
	}

	@Override
	public List<DonationCampaignResponse> getActiveDonationCampaigns() {
		return donationCampaignRepository.findActiveCampaigns().stream()
				.map(this::mapToDonationCampaignResponse)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public DonationCampaignResponse updateDonationCampaign(Integer id, DonationCampaignRequest request) {
		DonationCampaign campaign = donationCampaignRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Donation campaign not found with id: " + id));

		// Validate dates
		if (request.getEndDate() != null && request.getStartDate().isAfter(request.getEndDate())) {
			throw new BadRequestException("Start date must be before end date");
		}

		// Store old values for history
		String oldValues = "Name: " + campaign.getName() +
				", Description: " + campaign.getDescription() +
				", StartDate: " + campaign.getStartDate() +
				", EndDate: " + campaign.getEndDate() +
				", TargetAmount: " + campaign.getTargetAmount();

		// Update the campaign
		campaign.setName(request.getName());
		campaign.setDescription(request.getDescription());
		campaign.setStartDate(request.getStartDate());
		campaign.setEndDate(request.getEndDate());
		campaign.setTargetAmount(request.getTargetAmount());

		campaign = donationCampaignRepository.save(campaign);

		// Record history
		historyRecordService.recordAction(
				"DonationCampaign",
				campaign.getId(),
				"UPDATE",
				"Updated donation campaign from [" + oldValues + "] to [Name: " + campaign.getName() +
						", Description: " + campaign.getDescription() +
						", StartDate: " + campaign.getStartDate() +
						", EndDate: " + campaign.getEndDate() +
						", TargetAmount: " + campaign.getTargetAmount() + "]",
				getCurrentUsername()
		);

		return mapToDonationCampaignResponse(campaign);
	}

	@Override
	@Transactional
	public void deleteDonationCampaign(Integer id) {
		DonationCampaign campaign = donationCampaignRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Donation campaign not found with id: " + id));

		// Check if there are donations for this campaign
		Double donationAmount = donationRepository.getTotalDonationAmountByCampaignId(id);
		if (donationAmount != null && donationAmount > 0) {
			throw new BadRequestException("Cannot delete campaign that has donations");
		}

		// Record history before deletion
		historyRecordService.recordAction(
				"DonationCampaign",
				campaign.getId(),
				"DELETE",
				"Deleted donation campaign: " + campaign.getName(),
				getCurrentUsername()
		);

		donationCampaignRepository.deleteById(id);
	}

	private DonationCampaignResponse mapToDonationCampaignResponse(DonationCampaign campaign) {
		// Get total donated amount
		Double totalDonated = donationRepository.getTotalDonationAmountByCampaignId(campaign.getId());
		if (totalDonated == null) {
			totalDonated = 0.0;
		}

		// Calculate remaining amount
		Double remainingAmount = campaign.getTargetAmount() != null ?
				campaign.getTargetAmount() - totalDonated : null;

		// Count donors
		Integer totalDonors = campaign.getDonations() != null ?
				campaign.getDonations().size() : 0;

		// Check if campaign is active
		Boolean isActive = campaign.getEndDate() == null ||
				!campaign.getEndDate().isBefore(LocalDate.now());

		return DonationCampaignResponse.builder()
				.id(campaign.getId())
				.name(campaign.getName())
				.description(campaign.getDescription())
				.startDate(campaign.getStartDate())
				.endDate(campaign.getEndDate())
				.targetAmount(campaign.getTargetAmount())
				.totalDonated(totalDonated)
				.remainingAmount(remainingAmount)
				.totalDonors(totalDonors)
				.isActive(isActive)
				.createdBy(campaign.getCreatedBy())
				.createdAt(campaign.getCreatedAt())
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