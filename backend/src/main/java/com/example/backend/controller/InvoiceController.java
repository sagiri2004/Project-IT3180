package com.example.backend.controller;

import com.example.backend.dto.request.InvoiceRequest;
import com.example.backend.dto.response.InvoiceResponse;
import com.example.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/invoice")
@RequiredArgsConstructor
public class InvoiceController {

	private final InvoiceService invoiceService;

	@PostMapping
	public ResponseEntity<InvoiceResponse> create(@RequestBody InvoiceRequest request) {
		InvoiceResponse response = invoiceService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<InvoiceResponse> update(@PathVariable String id, @RequestBody InvoiceRequest request) {
		InvoiceResponse response = invoiceService.update(id, request);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<InvoiceResponse> delete(@PathVariable String id) {
		InvoiceResponse response = invoiceService.delete(id);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<InvoiceResponse>> getAll() {
		List<InvoiceResponse> responses = invoiceService.getAll();
		return ResponseEntity.ok(responses);
	}

	@GetMapping("/{id}")
	public ResponseEntity<InvoiceResponse> getById(@PathVariable String id) {
		InvoiceResponse response = invoiceService.getById(id);
		return ResponseEntity.ok(response);
	}
}
