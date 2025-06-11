package com.example.backend.service.impl;

import com.example.backend.dto.request.VehicleRequest;
import com.example.backend.dto.response.VehicleResponse;
import com.example.backend.model.Household;
import com.example.backend.model.Vehicle;
import com.example.backend.repository.HouseholdRepository;
import com.example.backend.repository.VehicleRepository;
import com.example.backend.service.VehicleService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository vehicleRepository;
    private final HouseholdRepository householdRepository;

    @Override
    @Transactional
    public VehicleResponse createVehicle(VehicleRequest request, String username) {
        if (vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new IllegalArgumentException("License plate already exists");
        }

        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new EntityNotFoundException("Household not found"));

        Vehicle vehicle = Vehicle.builder()
                .household(household)
                .licensePlate(request.getLicensePlate())
                .type(request.getType())
                .registeredDate(request.getRegisteredDate())
                .isActive(true)
                .createdBy(username)
                .build();

        return convertToResponse(vehicleRepository.save(vehicle));
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Integer id, VehicleRequest request, String username) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        if (!vehicle.getLicensePlate().equals(request.getLicensePlate()) &&
                vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new IllegalArgumentException("License plate already exists");
        }

        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new EntityNotFoundException("Household not found"));

        vehicle.setHousehold(household);
        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setType(request.getType());
        vehicle.setRegisteredDate(request.getRegisteredDate());

        return convertToResponse(vehicleRepository.save(vehicle));
    }

    @Override
    @Transactional
    public void deleteVehicle(Integer id, String username) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));
        vehicleRepository.delete(vehicle);
    }

    @Override
    public VehicleResponse getVehicle(Integer id) {
        return vehicleRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));
    }

    @Override
    public Page<VehicleResponse> getVehiclesByHousehold(Long householdId, Pageable pageable) {
        return vehicleRepository.findByHouseholdId(householdId, pageable)
                .map(this::convertToResponse);
    }

    @Override
    @Transactional
    public VehicleResponse toggleVehicleStatus(Integer id, String username) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));
        vehicle.setIsActive(!vehicle.getIsActive());
        return convertToResponse(vehicleRepository.save(vehicle));
    }

    @Override
    public Page<VehicleResponse> getAllVehicles(Pageable pageable) {
        return vehicleRepository.findAll(pageable)
                .map(vehicle -> VehicleResponse.builder()
                        .id(vehicle.getId())
                        .householdId(vehicle.getHousehold().getId())
                        .licensePlate(vehicle.getLicensePlate())
                        .type(vehicle.getType())
                        .registeredDate(vehicle.getRegisteredDate())
                        .isActive(vehicle.getIsActive())
                        .createdBy(vehicle.getCreatedBy())
                        .createdAt(vehicle.getCreatedAt())
                        .build());
    }

    private VehicleResponse convertToResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .householdId(vehicle.getHousehold().getId())
                .licensePlate(vehicle.getLicensePlate())
                .type(vehicle.getType())
                .registeredDate(vehicle.getRegisteredDate())
                .isActive(vehicle.getIsActive())
                .createdBy(vehicle.getCreatedBy())
                .createdAt(vehicle.getCreatedAt())
                .build();
    }
} 
 