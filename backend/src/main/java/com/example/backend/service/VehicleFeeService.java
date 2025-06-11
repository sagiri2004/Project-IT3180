package com.example.backend.service;

import com.example.backend.dto.request.VehicleFeeRequest;
import com.example.backend.dto.response.VehicleFeeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VehicleFeeService {
    Page<VehicleFeeResponse> getVehicleFees(Pageable pageable);
    Page<VehicleFeeResponse> getVehicleFeesByVehicle(Integer vehicleId, Pageable pageable);
    Page<VehicleFeeResponse> getVehicleFeesByVehicleAndMonth(Integer vehicleId, String monthYear, Pageable pageable);
    VehicleFeeResponse getVehicleFee(Integer id);
    VehicleFeeResponse createVehicleFee(VehicleFeeRequest request);
    VehicleFeeResponse updateVehicleFee(Integer id, VehicleFeeRequest request);
    void deleteVehicleFee(Integer id);
    VehicleFeeResponse markAsPaid(Integer id);
} 