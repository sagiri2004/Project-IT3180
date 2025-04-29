package com.example.backend.controller;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.HistoryRecordResponse;
import com.example.backend.service.HistoryRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/history")
@RequiredArgsConstructor
@Slf4j
public class HistoryRecordController {

	private final HistoryRecordService historyRecordService;

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<HistoryRecordResponse>> getHistoryRecordById(@PathVariable Integer id) {
		log.info("Fetching history record with id: {}", id);
		HistoryRecordResponse response = historyRecordService.getHistoryRecordById(id);
		return ResponseEntity.ok(new ApiResponse<>(true, "History record retrieved successfully", response));
	}

	@GetMapping("/entity/{entityType}/{entityId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<List<HistoryRecordResponse>>> getHistoryByEntityAndId(
			@PathVariable String entityType, @PathVariable Integer entityId) {
		log.info("Fetching history records for entity type: {} and id: {}", entityType, entityId);
		List<HistoryRecordResponse> response = historyRecordService.getHistoryByEntityAndId(entityType, entityId);
		return ResponseEntity.ok(new ApiResponse<>(true, "History records retrieved successfully", response));
	}

	@GetMapping("/user/{username}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<List<HistoryRecordResponse>>> getHistoryByUser(
			@PathVariable String username) {
		log.info("Fetching history records for user: {}", username);
		List<HistoryRecordResponse> response = historyRecordService.getHistoryByPerformedBy(username);
		return ResponseEntity.ok(new ApiResponse<>(true, "History records retrieved successfully", response));
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Page<HistoryRecordResponse>>> getAllHistoryRecords(Pageable pageable) {
		log.info("Fetching all history records with pagination: {}", pageable);
		Page<HistoryRecordResponse> response = historyRecordService.getAllHistoryRecords(pageable);
		return ResponseEntity.ok(new ApiResponse<>(true, "History records retrieved successfully", response));
	}

	@GetMapping("/entity-type/{entityType}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<List<HistoryRecordResponse>>> getHistoryByEntityType(
			@PathVariable String entityType) {
		log.info("Fetching history records for entity type: {}", entityType);
		List<HistoryRecordResponse> response = historyRecordService.getHistoryByEntityType(entityType);
		return ResponseEntity.ok(new ApiResponse<>(true, "History records retrieved successfully", response));
	}

	@GetMapping("/action-type/{actionType}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<List<HistoryRecordResponse>>> getHistoryByActionType(
			@PathVariable String actionType) {
		log.info("Fetching history records for action type: {}", actionType);
		List<HistoryRecordResponse> response = historyRecordService.getHistoryByActionType(actionType);
		return ResponseEntity.ok(new ApiResponse<>(true, "History records retrieved successfully", response));
	}
}