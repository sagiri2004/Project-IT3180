package com.example.backend.controller;

import com.example.backend.dto.request.FeeCollectionRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.FeeCollectionResponse;
import com.example.backend.service.FeeCollectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/fee-collections")
@RequiredArgsConstructor
@Slf4j
public class FeeCollectionController {

	private final FeeCollectionService feeCollectionService;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<FeeCollectionResponse>> createFeeCollection(
			@Valid @RequestBody FeeCollectionRequest request) {
		log.info("Creating new fee collection for household ID: {} and fee type ID: {}",
				request.getHouseholdId(), request.getFeeTypeId());
		FeeCollectionResponse response = feeCollectionService.createFeeCollection(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse<>(true, "Fee collection created successfully", response));
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<FeeCollectionResponse>> getFeeCollectionById(@PathVariable Integer id) {
		log.info("Fetching fee collection with id: {}", id);
		FeeCollectionResponse response = feeCollectionService.getFeeCollectionById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee collection retrieved successfully", response));
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<Page<FeeCollectionResponse>>> getAllFeeCollections(Pageable pageable) {
		log.info("Fetching all fee collections with pagination: {}", pageable);
		Page<FeeCollectionResponse> response = feeCollectionService.getAllFeeCollections(pageable);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee collections retrieved successfully", response));
	}

	@GetMapping("/household/{householdId}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<FeeCollectionResponse>>> getFeeCollectionsByHousehold(
			@PathVariable Integer householdId) {
		log.info("Fetching fee collections for household id: {}", householdId);
		List<FeeCollectionResponse> response = feeCollectionService.getFeeCollectionsByHousehold(householdId);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee collections retrieved successfully", response));
	}

	@GetMapping("/household/{householdId}/unpaid")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<FeeCollectionResponse>>> getUnpaidFeesByHousehold(
			@PathVariable Integer householdId) {
		log.info("Fetching unpaid fee collections for household id: {}", householdId);
		List<FeeCollectionResponse> response = feeCollectionService.getUnpaidFeesByHousehold(householdId);
		return ResponseEntity.ok(
				new ApiResponse<>(true, "Unpaid fee collections retrieved successfully", response));
	}

	@GetMapping("/year-month/{yearMonth}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<FeeCollectionResponse>>> getFeeCollectionsByYearMonth(
			@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {
		log.info("Fetching fee collections for year-month: {}", yearMonth);
		List<FeeCollectionResponse> response = feeCollectionService.getFeeCollectionsByYearMonth(yearMonth);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee collections retrieved successfully", response));
	}

	@GetMapping("/year-month/{yearMonth}/paginated")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<Page<FeeCollectionResponse>>> getFeeCollectionsByYearMonthPaginated(
			@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth, Pageable pageable) {
		log.info("Fetching fee collections for year-month: {} with pagination: {}", yearMonth, pageable);
		Page<FeeCollectionResponse> response =
				feeCollectionService.getFeeCollectionsByYearMonthPaginated(yearMonth, pageable);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee collections retrieved successfully", response));
	}

	@GetMapping("/year-month/{yearMonth}/unpaid")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<FeeCollectionResponse>>> getUnpaidFeesByYearMonth(
			@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {
		log.info("Fetching unpaid fee collections for year-month: {}", yearMonth);
		List<FeeCollectionResponse> response = feeCollectionService.getUnpaidFeesByYearMonth(yearMonth);
		return ResponseEntity.ok(
				new ApiResponse<>(true, "Unpaid fee collections retrieved successfully", response));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<FeeCollectionResponse>> updateFeeCollection(
			@PathVariable Integer id, @Valid @RequestBody FeeCollectionRequest request) {
		log.info("Updating fee collection with id: {}", id);
		FeeCollectionResponse response = feeCollectionService.updateFeeCollection(id, request);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee collection updated successfully", response));
	}

	@PostMapping("/{id}/mark-as-paid")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<FeeCollectionResponse>> markAsPaid(
			@PathVariable Integer id, @RequestParam String collectedBy) {
		log.info("Marking fee collection with id: {} as paid, collected by: {}", id, collectedBy);
		FeeCollectionResponse response = feeCollectionService.markAsPaid(id, collectedBy);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee collection marked as paid successfully", response));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Void>> deleteFeeCollection(@PathVariable Integer id) {
		log.info("Deleting fee collection with id: {}", id);
		feeCollectionService.deleteFeeCollection(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee collection deleted successfully", null));
	}

	@PostMapping("/generate-monthly/{yearMonth}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Void>> generateMonthlyFeeCollections(
			@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {
		log.info("Generating monthly fee collections for all households for: {}", yearMonth);
		feeCollectionService.generateMonthlyFeeCollectionsForAllHouseholds(yearMonth);
		return ResponseEntity.ok(
				new ApiResponse<>(true, "Monthly fee collections generated successfully", null));
	}

	@GetMapping("/statistics/{yearMonth}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Map<String, Double>>> getCollectionStatsByYearMonth(
			@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {
		log.info("Fetching collection statistics for year-month: {}", yearMonth);
		Map<String, Double> stats = feeCollectionService.getCollectionStatsByYearMonth(yearMonth);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee collection statistics retrieved successfully", stats));
	}
}