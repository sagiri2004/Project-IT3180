package com.example.backend.controller;

import com.example.backend.dto.request.VehicleFeeRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.VehicleFeeResponse;
import com.example.backend.service.VehicleFeeService;
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
@RequestMapping("/api/v1/vehicle-fees")
@RequiredArgsConstructor
public class VehicleFeeController {
    private final VehicleFeeService vehicleFeeService;

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleFeeResponse>> createVehicleFee(
            @Valid @RequestBody VehicleFeeRequest request) {
        VehicleFeeResponse response = vehicleFeeService.createVehicleFee(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleFeeResponse>> updateVehicleFee(
            @PathVariable Integer id,
            @Valid @RequestBody VehicleFeeRequest request) {
        VehicleFeeResponse response = vehicleFeeService.updateVehicleFee(id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVehicleFee(
            @PathVariable Integer id) {
        vehicleFeeService.deleteVehicleFee(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleFeeResponse>> getVehicleFee(@PathVariable Integer id) {
        VehicleFeeResponse response = vehicleFeeService.getVehicleFee(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<VehicleFeeResponse>>> getVehicleFees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<VehicleFeeResponse> vehicleFees = vehicleFeeService.getVehicleFees(pageRequest);
        return ResponseEntity.ok(ApiResponse.success(vehicleFees));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<ApiResponse<Page<VehicleFeeResponse>>> getVehicleFeesByVehicle(
            @PathVariable Integer vehicleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<VehicleFeeResponse> vehicleFees = vehicleFeeService.getVehicleFeesByVehicle(vehicleId, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(vehicleFees));
    }

    @GetMapping("/vehicle/{vehicleId}/month/{monthYear}")
    public ResponseEntity<ApiResponse<Page<VehicleFeeResponse>>> getVehicleFeesByVehicleAndMonth(
            @PathVariable Integer vehicleId,
            @PathVariable String monthYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<VehicleFeeResponse> vehicleFees = vehicleFeeService.getVehicleFeesByVehicleAndMonth(vehicleId, monthYear, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(vehicleFees));
    }

    @PatchMapping("/{id}/mark-as-paid")
    public ResponseEntity<ApiResponse<VehicleFeeResponse>> markAsPaid(
            @PathVariable Integer id) {
        VehicleFeeResponse response = vehicleFeeService.markAsPaid(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/day-ticket")
    public ResponseEntity<ApiResponse<VehicleFeeResponse>> createDayTicket(@Valid @RequestBody VehicleFeeRequest request) {
        VehicleFeeResponse response = vehicleFeeService.createDayTicket(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<ApiResponse<VehicleFeeResponse>> renewMonthlyTicket(@PathVariable Integer id) {
        VehicleFeeResponse response = vehicleFeeService.renewMonthlyTicket(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
} 