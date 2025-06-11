package com.example.backend.service;

import com.example.backend.dto.request.VehicleRequest;
import com.example.backend.dto.response.VehicleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VehicleService {
    VehicleResponse createVehicle(VehicleRequest request, String username);
    VehicleResponse updateVehicle(Integer id, VehicleRequest request, String username);
    void deleteVehicle(Integer id, String username);
    VehicleResponse getVehicle(Integer id);
    Page<VehicleResponse> getAllVehicles(Pageable pageable);
    Page<VehicleResponse> getVehiclesByHousehold(Long householdId, Pageable pageable);
    VehicleResponse toggleVehicleStatus(Integer id, String username);
} 