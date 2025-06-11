package com.example.backend.controller;

import com.example.backend.dto.request.VehicleRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.VehicleResponse;
import com.example.backend.service.VehicleService;
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
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleResponse>> createVehicle(
            @Valid @RequestBody VehicleRequest request,
            Authentication authentication) {
        VehicleResponse response = vehicleService.createVehicle(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateVehicle(
            @PathVariable Integer id,
            @Valid @RequestBody VehicleRequest request,
            Authentication authentication) {
        VehicleResponse response = vehicleService.updateVehicle(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(
            @PathVariable Integer id,
            Authentication authentication) {
        vehicleService.deleteVehicle(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicle(@PathVariable Integer id) {
        VehicleResponse response = vehicleService.getVehicle(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/household/{householdId}")
    public ResponseEntity<ApiResponse<Page<VehicleResponse>>> getVehiclesByHousehold(
            @PathVariable Long householdId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getVehiclesByHousehold(householdId, pageable)));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<VehicleResponse>> toggleVehicleStatus(
            @PathVariable Integer id,
            Authentication authentication) {
        VehicleResponse response = vehicleService.toggleVehicleStatus(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<VehicleResponse>>> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getAllVehicles(pageRequest)));
    }
} 