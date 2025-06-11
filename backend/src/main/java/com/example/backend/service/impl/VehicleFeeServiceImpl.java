package com.example.backend.service.impl;

import com.example.backend.dto.request.VehicleFeeRequest;
import com.example.backend.dto.response.VehicleFeeResponse;
import com.example.backend.model.Vehicle;
import com.example.backend.model.VehicleFee;
import com.example.backend.repository.VehicleFeeRepository;
import com.example.backend.repository.VehicleRepository;
import com.example.backend.service.VehicleFeeService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VehicleFeeServiceImpl implements VehicleFeeService {
    private final VehicleFeeRepository vehicleFeeRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public Page<VehicleFeeResponse> getVehicleFees(Pageable pageable) {
        return vehicleFeeRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<VehicleFeeResponse> getVehicleFeesByVehicle(Integer vehicleId, Pageable pageable) {
        return vehicleFeeRepository.findByVehicleId(vehicleId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<VehicleFeeResponse> getVehicleFeesByVehicleAndMonth(Integer vehicleId, String monthYear, Pageable pageable) {
        return vehicleFeeRepository.findByVehicleIdAndMonthYear(vehicleId, monthYear, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public VehicleFeeResponse getVehicleFee(Integer id) {
        return vehicleFeeRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle fee not found with id: " + id));
    }

    @Override
    @Transactional
    public VehicleFeeResponse createVehicleFee(VehicleFeeRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with id: " + request.getVehicleId()));

        VehicleFee vehicleFee = new VehicleFee();
        vehicleFee.setVehicle(vehicle);
        vehicleFee.setMonthYear(request.getMonthYear());
        vehicleFee.setAmount(request.getAmount());
        vehicleFee.setIsPaid(false);
        vehicleFee.setCreatedAt(LocalDateTime.now());

        return mapToResponse(vehicleFeeRepository.save(vehicleFee));
    }

    @Override
    @Transactional
    public VehicleFeeResponse updateVehicleFee(Integer id, VehicleFeeRequest request) {
        VehicleFee vehicleFee = vehicleFeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle fee not found with id: " + id));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with id: " + request.getVehicleId()));

        vehicleFee.setVehicle(vehicle);
        vehicleFee.setMonthYear(request.getMonthYear());
        vehicleFee.setAmount(request.getAmount());

        return mapToResponse(vehicleFeeRepository.save(vehicleFee));
    }

    @Override
    @Transactional
    public void deleteVehicleFee(Integer id) {
        if (!vehicleFeeRepository.existsById(id)) {
            throw new EntityNotFoundException("Vehicle fee not found with id: " + id);
        }
        vehicleFeeRepository.deleteById(id);
    }

    @Override
    @Transactional
    public VehicleFeeResponse markAsPaid(Integer id) {
        VehicleFee vehicleFee = vehicleFeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle fee not found with id: " + id));

        vehicleFee.setIsPaid(true);
        vehicleFee.setPaidDate(LocalDate.now());

        return mapToResponse(vehicleFeeRepository.save(vehicleFee));
    }

    private VehicleFeeResponse mapToResponse(VehicleFee vehicleFee) {
        return VehicleFeeResponse.builder()
                .id(vehicleFee.getId())
                .vehicleId(vehicleFee.getVehicle().getId())
                .monthYear(vehicleFee.getMonthYear())
                .amount(vehicleFee.getAmount())
                .isPaid(vehicleFee.getIsPaid())
                .paidDate(vehicleFee.getPaidDate())
                .paidBy(vehicleFee.getPaidBy())
                .collectedBy(vehicleFee.getCollectedBy())
                .createdBy(vehicleFee.getCreatedBy())
                .createdAt(vehicleFee.getCreatedAt())
                .build();
    }
} 