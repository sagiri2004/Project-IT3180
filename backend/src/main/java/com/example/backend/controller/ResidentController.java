package com.example.backend.controller;

import com.example.backend.dto.request.ResidentRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.ResidentResponse;
import com.example.backend.service.ResidentService;
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
@RequestMapping("/api/v1/residents")
@RequiredArgsConstructor
@Slf4j
public class ResidentController {

	private final ResidentService residentService;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<ResidentResponse>> createResident(
			@Valid @RequestBody ResidentRequest request) {
		log.info("Creating new resident: {}", request.getFullName());
		ResidentResponse response = residentService.createResident(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse<>(true, "Resident created successfully", response));
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<ResidentResponse>> getResidentById(@PathVariable Integer id) {
		log.info("Fetching resident with id: {}", id);
		ResidentResponse response = residentService.getResidentById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Resident retrieved successfully", response));
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<Page<ResidentResponse>>> getAllResidents(Pageable pageable) {
		log.info("Fetching all residents with pagination: {}", pageable);
		Page<ResidentResponse> response = residentService.getAllResidents(pageable);
		return ResponseEntity.ok(new ApiResponse<>(true, "Residents retrieved successfully", response));
	}

	@GetMapping("/household/{householdId}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<ResidentResponse>>> getResidentsByHousehold(
			@PathVariable Integer householdId) {
		log.info("Fetching residents for household id: {}", householdId);
		List<ResidentResponse> response = residentService.getResidentsByHousehold(householdId);
		return ResponseEntity.ok(new ApiResponse<>(true, "Residents retrieved successfully", response));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<ResidentResponse>> updateResident(
			@PathVariable Integer id, @Valid @RequestBody ResidentRequest request) {
		log.info("Updating resident with id: {}", id);
		ResidentResponse response = residentService.updateResident(id, request);
		return ResponseEntity.ok(new ApiResponse<>(true, "Resident updated successfully", response));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Void>> deleteResident(@PathVariable Integer id) {
		log.info("Deleting resident with id: {}", id);
		residentService.deleteResident(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Resident deleted successfully", null));
	}

	@GetMapping("/search")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<ResidentResponse>>> searchResidents(
			@RequestParam String keyword) {
		log.info("Searching residents with keyword: {}", keyword);
		List<ResidentResponse> response = residentService.searchResidents(keyword);
		return ResponseEntity.ok(new ApiResponse<>(true, "Search results", response));
	}
}