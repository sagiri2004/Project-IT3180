package com.example.backend.controller;

import com.example.backend.dto.request.HouseholdRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.HouseholdResponse;
import com.example.backend.service.HouseholdService;
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
@RequestMapping("/api/v1/households")
@RequiredArgsConstructor
@Slf4j
public class HouseholdController {

	private final HouseholdService householdService;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<HouseholdResponse>> createHousehold(
			@Valid @RequestBody HouseholdRequest request) {
		log.info("Creating new household with code: {}", request.getHouseholdCode());
		HouseholdResponse response = householdService.createHousehold(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse<>(true, "Household created successfully", response));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<HouseholdResponse>> getHouseholdById(@PathVariable Integer id) {
		log.info("Fetching household with id: {}", id);
		HouseholdResponse response = householdService.getHouseholdById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Household retrieved successfully", response));
	}

	@GetMapping("/code/{code}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<HouseholdResponse>> getHouseholdByCode(@PathVariable String code) {
		log.info("Fetching household with code: {}", code);
		HouseholdResponse response = householdService.getHouseholdByCode(code);
		return ResponseEntity.ok(new ApiResponse<>(true, "Household retrieved successfully", response));
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<Page<HouseholdResponse>>> getAllHouseholds(
			Pageable pageable,
			@RequestParam(value = "keyword", required = false) String keyword) {
		log.info("Fetching all households with pagination: {} and keyword: {}", pageable, keyword);
		if (keyword != null && !keyword.trim().isEmpty()) {
			List<HouseholdResponse> searchResults = householdService.searchHouseholds(keyword);
			// Tạo Page thủ công từ List
			int start = (int) pageable.getOffset();
			int end = Math.min((start + pageable.getPageSize()), searchResults.size());
			List<HouseholdResponse> pageContent = searchResults.subList(start, end);
			Page<HouseholdResponse> page = new org.springframework.data.domain.PageImpl<>(pageContent, pageable, searchResults.size());
			return ResponseEntity.ok(new ApiResponse<>(true, "Households retrieved successfully", page));
		}
		Page<HouseholdResponse> response = householdService.getAllHouseholds(pageable);
		return ResponseEntity.ok(new ApiResponse<>(true, "Households retrieved successfully", response));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<HouseholdResponse>> updateHousehold(
			@PathVariable Integer id, @Valid @RequestBody HouseholdRequest request) {
		log.info("Updating household with id: {}", id);
		HouseholdResponse response = householdService.updateHousehold(id, request);
		return ResponseEntity.ok(new ApiResponse<>(true, "Household updated successfully", response));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Void>> deleteHousehold(@PathVariable Integer id) {
		log.info("Deleting household with id: {}", id);
		householdService.deleteHousehold(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Household deleted successfully", null));
	}

	@GetMapping("/search")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<HouseholdResponse>>> searchHouseholds(
			@RequestParam String keyword) {
		log.info("Searching households with keyword: {}", keyword);
		List<HouseholdResponse> response = householdService.searchHouseholds(keyword);
		return ResponseEntity.ok(new ApiResponse<>(true, "Search results", response));
	}
}