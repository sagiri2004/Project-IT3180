package com.example.backend.controller;

import com.example.backend.dto.request.RevenueRequest;
import com.example.backend.dto.response.RevenueResponse;
import com.example.backend.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/revenue")
@RequiredArgsConstructor
public class RevenueController {

	private final RevenueService revenueService;

	@PostMapping
	public ResponseEntity<RevenueResponse> create(@RequestBody RevenueRequest request) {
		RevenueResponse response = revenueService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<RevenueResponse> update(@PathVariable String id, @RequestBody RevenueRequest request) {
		RevenueResponse response = revenueService.update(id, request);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<RevenueResponse> delete(@PathVariable String id) {
		RevenueResponse response = revenueService.delete(id);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<RevenueResponse>> getAll() {
		List<RevenueResponse> responseList = (List<RevenueResponse>) revenueService.getAll();
		return ResponseEntity.ok(responseList);
	}

	@GetMapping("/{id}")
	public ResponseEntity<RevenueResponse> getById(@PathVariable String id) {
		RevenueResponse response = revenueService.getById(id);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

}
