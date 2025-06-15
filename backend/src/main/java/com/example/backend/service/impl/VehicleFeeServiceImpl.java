package com.example.backend.service.impl;

import com.example.backend.dto.request.VehicleFeeRequest;
import com.example.backend.dto.response.VehicleFeeResponse;
import com.example.backend.model.Vehicle;
import com.example.backend.model.VehicleFee;
import com.example.backend.model.VehicleFeeConfig;
import com.example.backend.model.enums.TicketType;
import com.example.backend.repository.VehicleFeeRepository;
import com.example.backend.repository.VehicleRepository;
import com.example.backend.repository.VehicleFeeConfigRepository;
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
    private final VehicleFeeConfigRepository vehicleFeeConfigRepository;

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
        TicketType ticketType = TicketType.valueOf(request.getTicketType());
        VehicleFeeConfig config = vehicleFeeConfigRepository.findByVehicleTypeAndTicketType(vehicle.getType(), ticketType)
                .orElseThrow(() -> new IllegalArgumentException("No fee config for this vehicle type and ticket type"));
        VehicleFee vehicleFee = new VehicleFee();
        vehicleFee.setVehicle(vehicle);
        vehicleFee.setMonthYear(request.getMonthYear());
        vehicleFee.setIsPaid(false);
        vehicleFee.setTicketType(ticketType);
        vehicleFee.setAmount(config.getPrice());
        if (ticketType == TicketType.MONTHLY) {
            String[] ym = request.getMonthYear().split("-");
            int year = Integer.parseInt(ym[0]);
            int month = Integer.parseInt(ym[1]);
            vehicleFee.setValidFrom(LocalDate.of(year, month, 1));
            vehicleFee.setValidTo(LocalDate.of(year, month, 1).plusMonths(1).minusDays(1));
        } else if (ticketType == TicketType.DAILY && request.getDay() != null) {
            LocalDate day = LocalDate.parse(request.getDay());
            vehicleFee.setDay(day);
            vehicleFee.setValidFrom(day);
            vehicleFee.setValidTo(day);
        }
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

    @Override
    @Transactional
    public VehicleFeeResponse createDayTicket(VehicleFeeRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with id: " + request.getVehicleId()));
        TicketType ticketType = TicketType.DAILY;
        VehicleFeeConfig config = vehicleFeeConfigRepository.findByVehicleTypeAndTicketType(vehicle.getType(), ticketType)
                .orElseThrow(() -> new IllegalArgumentException("No fee config for this vehicle type and ticket type"));
        VehicleFee vehicleFee = new VehicleFee();
        vehicleFee.setVehicle(vehicle);
        vehicleFee.setTicketType(ticketType);
        vehicleFee.setAmount(config.getPrice());
        if (request.getDay() == null) throw new IllegalArgumentException("Day is required for daily ticket");
        LocalDate day = LocalDate.parse(request.getDay());
        vehicleFee.setDay(day);
        vehicleFee.setValidFrom(day);
        vehicleFee.setValidTo(day);
        vehicleFee.setIsPaid(false);
        vehicleFee.setCreatedAt(LocalDateTime.now());
        return mapToResponse(vehicleFeeRepository.save(vehicleFee));
    }

    @Override
    @Transactional
    public VehicleFeeResponse renewMonthlyTicket(Integer id) {
        VehicleFee oldFee = vehicleFeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle fee not found with id: " + id));
        if (oldFee.getTicketType() != TicketType.MONTHLY) throw new IllegalArgumentException("Only monthly tickets can be renewed");
        VehicleFeeConfig config = vehicleFeeConfigRepository.findByVehicleTypeAndTicketType(oldFee.getVehicle().getType(), TicketType.MONTHLY)
                .orElseThrow(() -> new IllegalArgumentException("No fee config for this vehicle type and ticket type"));
        VehicleFee newFee = new VehicleFee();
        newFee.setVehicle(oldFee.getVehicle());
        newFee.setTicketType(TicketType.MONTHLY);
        newFee.setAmount(config.getPrice());
        String[] ym = oldFee.getMonthYear().split("-");
        int year = Integer.parseInt(ym[0]);
        int month = Integer.parseInt(ym[1]);
        if (month == 12) { year++; month = 1; } else { month++; }
        String nextMonthYear = String.format("%04d-%02d", year, month);
        newFee.setMonthYear(nextMonthYear);
        newFee.setValidFrom(LocalDate.of(year, month, 1));
        newFee.setValidTo(LocalDate.of(year, month, 1).plusMonths(1).minusDays(1));
        newFee.setIsPaid(false);
        newFee.setCreatedAt(LocalDateTime.now());
        return mapToResponse(vehicleFeeRepository.save(newFee));
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