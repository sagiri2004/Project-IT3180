package com.example.backend.controller;

import com.example.backend.dto.request.FeeTypeRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.FeeTypeResponse;
import com.example.backend.service.FeeTypeService;
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
@RequestMapping("/api/v1/fee-types")
@RequiredArgsConstructor
@Slf4j
public class FeeTypeController {

	private final FeeTypeService feeTypeService;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<FeeTypeResponse>> createFeeType(
			@Valid @RequestBody FeeTypeRequest request) {
		log.info("Creating new fee type: {}", request.getName());
		FeeTypeResponse response = feeTypeService.createFeeType(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse<>(true, "Fee type created successfully", response));
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<FeeTypeResponse>> getFeeTypeById(@PathVariable Integer id) {
		log.info("Fetching fee type with id: {}", id);
		FeeTypeResponse response = feeTypeService.getFeeTypeById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee type retrieved successfully", response));
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<Page<FeeTypeResponse>>> getAllFeeTypes(Pageable pageable) {
		log.info("Fetching all fee types with pagination: {}", pageable);
		Page<FeeTypeResponse> response = feeTypeService.getAllFeeTypes(pageable);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee types retrieved successfully", response));
	}

	@GetMapping("/required")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<FeeTypeResponse>>> getRequiredFeeTypes() {
		log.info("Fetching required fee types");
		List<FeeTypeResponse> response = feeTypeService.getRequiredFeeTypes();
		return ResponseEntity.ok(new ApiResponse<>(true, "Required fee types retrieved successfully", response));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<FeeTypeResponse>> updateFeeType(
			@PathVariable Integer id, @Valid @RequestBody FeeTypeRequest request) {
		log.info("Updating fee type with id: {}", id);
		FeeTypeResponse response = feeTypeService.updateFeeType(id, request);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee type updated successfully", response));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Void>> deleteFeeType(@PathVariable Integer id) {
		log.info("Deleting fee type with id: {}", id);
		feeTypeService.deleteFeeType(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Fee type deleted successfully", null));
	}
}