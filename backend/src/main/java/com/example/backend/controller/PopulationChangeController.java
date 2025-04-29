package com.example.backend.controller;

import com.example.backend.dto.request.PopulationChangeRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PopulationChangeResponse;
import com.example.backend.service.PopulationChangeService;
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
@RequestMapping("/api/v1/population-changes")
@RequiredArgsConstructor
@Slf4j
public class PopulationChangeController {

	private final PopulationChangeService populationChangeService;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<PopulationChangeResponse>> createPopulationChange(
			@Valid @RequestBody PopulationChangeRequest request) {
		log.info("Creating new population change for resident id: {}", request.getResidentId());
		PopulationChangeResponse response = populationChangeService.createPopulationChange(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse<>(true, "Population change created successfully", response));
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<PopulationChangeResponse>> getPopulationChangeById(@PathVariable Integer id) {
		log.info("Fetching population change with id: {}", id);
		PopulationChangeResponse response = populationChangeService.getPopulationChangeById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Population change retrieved successfully", response));
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<Page<PopulationChangeResponse>>> getAllPopulationChanges(Pageable pageable) {
		log.info("Fetching all population changes with pagination: {}", pageable);
		Page<PopulationChangeResponse> response = populationChangeService.getAllPopulationChanges(pageable);
		return ResponseEntity.ok(new ApiResponse<>(true, "Population changes retrieved successfully", response));
	}

	@GetMapping("/resident/{residentId}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<PopulationChangeResponse>>> getPopulationChangesByResident(
			@PathVariable Integer residentId) {
		log.info("Fetching population changes for resident id: {}", residentId);
		List<PopulationChangeResponse> response = populationChangeService.getPopulationChangesByResident(residentId);
		return ResponseEntity.ok(new ApiResponse<>(true, "Population changes retrieved successfully", response));
	}

	@GetMapping("/household/{householdId}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<ApiResponse<List<PopulationChangeResponse>>> getPopulationChangesByHousehold(
			@PathVariable Integer householdId) {
		log.info("Fetching population changes for household id: {}", householdId);
		List<PopulationChangeResponse> response = populationChangeService.getPopulationChangesByHousehold(householdId);
		return ResponseEntity.ok(new ApiResponse<>(true, "Population changes retrieved successfully", response));
	}

	@GetMapping("/pending")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<List<PopulationChangeResponse>>> getPendingPopulationChanges() {
		log.info("Fetching pending population changes");
		List<PopulationChangeResponse> response = populationChangeService.getPendingPopulationChanges();
		return ResponseEntity.ok(new ApiResponse<>(true, "Pending population changes retrieved successfully", response));
	}

	@PostMapping("/{id}/approve")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<PopulationChangeResponse>> approvePopulationChange(@PathVariable Integer id) {
		log.info("Approving population change with id: {}", id);
		PopulationChangeResponse response = populationChangeService.approvePopulationChange(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Population change approved successfully", response));
	}

	@PostMapping("/{id}/reject")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<PopulationChangeResponse>> rejectPopulationChange(@PathVariable Integer id) {
		log.info("Rejecting population change with id: {}", id);
		PopulationChangeResponse response = populationChangeService.rejectPopulationChange(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Population change rejected successfully", response));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<PopulationChangeResponse>> updatePopulationChange(
			@PathVariable Integer id, @Valid @RequestBody PopulationChangeRequest request) {
		log.info("Updating population change with id: {}", id);
		PopulationChangeResponse response = populationChangeService.updatePopulationChange(id, request);
		return ResponseEntity.ok(new ApiResponse<>(true, "Population change updated successfully", response));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Void>> deletePopulationChange(@PathVariable Integer id) {
		log.info("Deleting population change with id: {}", id);
		populationChangeService.deletePopulationChange(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "Population change deleted successfully", null));
	}
}