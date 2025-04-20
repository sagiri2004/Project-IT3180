package com.example.backend.controller;

import com.example.backend.dto.request.HouseholdRequest;
import com.example.backend.dto.response.HouseholdResponse;
import com.example.backend.service.HouseholdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/household")
@RequiredArgsConstructor
public class HouseholdController {

	private final HouseholdService householdService;

	@PostMapping
	public ResponseEntity<HouseholdResponse> create(@RequestBody HouseholdRequest request) {
		HouseholdResponse response = householdService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<HouseholdResponse> update(@PathVariable String id, @RequestBody HouseholdRequest request) {
		HouseholdResponse response = householdService.update(id, request);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<HouseholdResponse> delete(@PathVariable String id) {
		HouseholdResponse response = householdService.delete(id);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<HouseholdResponse>> getAll() {
		List<HouseholdResponse> responseList = householdService.getAll();
		return ResponseEntity.ok(responseList);
	}

	@GetMapping("/{id}")
	public ResponseEntity<HouseholdResponse> getById(@PathVariable String id) {
		HouseholdResponse response = householdService.getById(id);
		return ResponseEntity.ok(response);
	}
}
