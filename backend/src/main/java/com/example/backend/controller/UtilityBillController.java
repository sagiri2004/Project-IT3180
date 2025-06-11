package com.example.backend.controller;

import com.example.backend.dto.request.UtilityBillRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.UtilityBillResponse;
import com.example.backend.service.UtilityBillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/utility-bills")
@RequiredArgsConstructor
public class UtilityBillController {
    private final UtilityBillService utilityBillService;

    @PostMapping
    public ResponseEntity<ApiResponse<UtilityBillResponse>> createUtilityBill(
            @Valid @RequestBody UtilityBillRequest request) {
        UtilityBillResponse response = utilityBillService.createUtilityBill(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UtilityBillResponse>> updateUtilityBill(
            @PathVariable Integer id,
            @Valid @RequestBody UtilityBillRequest request) {
        UtilityBillResponse response = utilityBillService.updateUtilityBill(id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUtilityBill(
            @PathVariable Integer id) {
        utilityBillService.deleteUtilityBill(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UtilityBillResponse>> getUtilityBill(@PathVariable Integer id) {
        UtilityBillResponse response = utilityBillService.getUtilityBill(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UtilityBillResponse>>> getUtilityBills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<UtilityBillResponse> utilityBills = utilityBillService.getUtilityBills(pageRequest);
        return ResponseEntity.ok(ApiResponse.success(utilityBills));
    }

    @GetMapping("/household/{householdId}")
    public ResponseEntity<ApiResponse<Page<UtilityBillResponse>>> getUtilityBillsByHousehold(
            @PathVariable Integer householdId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<UtilityBillResponse> utilityBills = utilityBillService.getUtilityBillsByHousehold(householdId, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(utilityBills));
    }

    @GetMapping("/household/{householdId}/month/{monthYear}")
    public ResponseEntity<ApiResponse<Page<UtilityBillResponse>>> getUtilityBillsByHouseholdAndMonth(
            @PathVariable Integer householdId,
            @PathVariable String monthYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<UtilityBillResponse> utilityBills = utilityBillService.getUtilityBillsByHouseholdAndMonth(householdId, monthYear, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(utilityBills));
    }

    @PatchMapping("/{id}/mark-as-paid")
    public ResponseEntity<ApiResponse<UtilityBillResponse>> markAsPaid(
            @PathVariable Integer id) {
        UtilityBillResponse response = utilityBillService.markAsPaid(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
} 