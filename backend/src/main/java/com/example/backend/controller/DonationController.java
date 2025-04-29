package com.example.backend.controller;

import com.example.backend.dto.request.DonationRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.DonationResponse;
import com.example.backend.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/donations")
@RequiredArgsConstructor
@Slf4j
public class DonationController {

	private final DonationService donationService;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<DonationResponse>> createDonation(
			@Valid @RequestBody DonationRequest request) {
		log.info("Creating new donation for household ID: {} and campaign ID: {}",
				request.getHouseholdId(), request.getDonationCampaignId());
		DonationResponse response = donationService.createDonation(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse<>(true, "Donation created successfully", response));
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<DonationResponse>> getDonationById(@PathVariable Integer id) {
		log.info("Fetching donation with id: {}", id);
		DonationResponse response = donationService.getDonationById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Donation retrieved successfully", response));
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<Page<DonationResponse>>> getAllDonations(Pageable pageable) {
		log.info("Fetching all donations with pagination: {}", pageable);
		Page<DonationResponse> response = donationService.getAllDonations(pageable);
		return ResponseEntity.ok(new ApiResponse<>(true, "Donations retrieved successfully", response));
	}

	@GetMapping("/household/{householdId}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<DonationResponse>>> getDonationsByHousehold(
			@PathVariable Integer householdId) {
		log.info("Fetching donations for household id: {}", householdId);
		List<DonationResponse> response = donationService.getDonationsByHousehold(householdId);
		return ResponseEntity.ok(new ApiResponse<>(true, "Donations retrieved successfully", response));
	}

	@GetMapping("/campaign/{campaignId}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<DonationResponse>>> getDonationsByCampaign(
			@PathVariable Integer campaignId) {
		log.info("Fetching donations for campaign id: {}", campaignId);
		List<DonationResponse> response = donationService.getDonationsByCampaign(campaignId);
		return ResponseEntity.ok(new ApiResponse<>(true, "Donations retrieved successfully", response));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<DonationResponse>> updateDonation(
			@PathVariable Integer id, @Valid @RequestBody DonationRequest request) {
		log.info("Updating donation with id: {}", id);
		DonationResponse response = donationService.updateDonation(id, request);
		return ResponseEntity.ok(new ApiResponse<>(true, "Donation updated successfully", response));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Void>> deleteDonation(@PathVariable Integer id) {
		log.info("Deleting donation with id: {}", id);
		donationService.deleteDonation(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Donation deleted successfully", null));
	}
}