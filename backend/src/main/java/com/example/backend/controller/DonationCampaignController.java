package com.example.backend.controller;

import com.example.backend.dto.request.DonationCampaignRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.DonationCampaignResponse;
import com.example.backend.service.DonationCampaignService;
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
@RequestMapping("/api/v1/donation-campaigns")
@RequiredArgsConstructor
@Slf4j
public class DonationCampaignController {

	private final DonationCampaignService donationCampaignService;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<DonationCampaignResponse>> createDonationCampaign(
			@Valid @RequestBody DonationCampaignRequest request) {
		log.info("Creating new donation campaign: {}", request.getName());
		DonationCampaignResponse response = donationCampaignService.createDonationCampaign(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse<>(true, "Donation campaign created successfully", response));
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<DonationCampaignResponse>> getDonationCampaignById(@PathVariable Integer id) {
		log.info("Fetching donation campaign with id: {}", id);
		DonationCampaignResponse response = donationCampaignService.getDonationCampaignById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Donation campaign retrieved successfully", response));
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<Page<DonationCampaignResponse>>> getAllDonationCampaigns(Pageable pageable) {
		log.info("Fetching all donation campaigns with pagination: {}", pageable);
		Page<DonationCampaignResponse> response = donationCampaignService.getAllDonationCampaigns(pageable);
		return ResponseEntity.ok(new ApiResponse<>(true, "Donation campaigns retrieved successfully", response));
	}

	@GetMapping("/active")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<DonationCampaignResponse>>> getActiveDonationCampaigns() {
		log.info("Fetching active donation campaigns");
		List<DonationCampaignResponse> response = donationCampaignService.getActiveDonationCampaigns();
		return ResponseEntity.ok(new ApiResponse<>(true, "Active donation campaigns retrieved successfully", response));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<DonationCampaignResponse>> updateDonationCampaign(
			@PathVariable Integer id, @Valid @RequestBody DonationCampaignRequest request) {
		log.info("Updating donation campaign with id: {}", id);
		DonationCampaignResponse response = donationCampaignService.updateDonationCampaign(id, request);
		return ResponseEntity.ok(new ApiResponse<>(true, "Donation campaign updated successfully", response));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Void>> deleteDonationCampaign(@PathVariable Integer id) {
		log.info("Deleting donation campaign with id: {}", id);
		donationCampaignService.deleteDonationCampaign(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Donation campaign deleted successfully", null));
	}
}