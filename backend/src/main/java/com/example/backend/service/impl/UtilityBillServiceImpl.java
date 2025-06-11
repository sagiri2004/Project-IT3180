package com.example.backend.service.impl;

import com.example.backend.dto.request.UtilityBillRequest;
import com.example.backend.dto.response.UtilityBillResponse;
import com.example.backend.model.Household;
import com.example.backend.model.UtilityBill;
import com.example.backend.model.enums.UtilityType;
import com.example.backend.repository.HouseholdRepository;
import com.example.backend.repository.UtilityBillRepository;
import com.example.backend.service.UtilityBillService;
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
public class UtilityBillServiceImpl implements UtilityBillService {
    private final UtilityBillRepository utilityBillRepository;
    private final HouseholdRepository householdRepository;

    @Override
    public Page<UtilityBillResponse> getUtilityBills(Pageable pageable) {
        return utilityBillRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<UtilityBillResponse> getUtilityBillsByHousehold(Integer householdId, Pageable pageable) {
        return utilityBillRepository.findByHouseholdId(householdId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<UtilityBillResponse> getUtilityBillsByHouseholdAndMonth(Integer householdId, String monthYear, Pageable pageable) {
        return utilityBillRepository.findByHouseholdIdAndMonthYear(householdId, monthYear, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public UtilityBillResponse getUtilityBill(Integer id) {
        return utilityBillRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new EntityNotFoundException("Utility bill not found with id: " + id));
    }

    @Override
    @Transactional
    public UtilityBillResponse createUtilityBill(UtilityBillRequest request) {
        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new EntityNotFoundException("Household not found with id: " + request.getHouseholdId()));

        UtilityBill utilityBill = new UtilityBill();
        utilityBill.setHousehold(household);
        utilityBill.setMonthYear(request.getMonthYear());
        utilityBill.setType(request.getType());
        utilityBill.setAmount(request.getAmount());
        utilityBill.setIsPaid(false);
        utilityBill.setCreatedAt(LocalDateTime.now());

        return mapToResponse(utilityBillRepository.save(utilityBill));
    }

    @Override
    @Transactional
    public UtilityBillResponse updateUtilityBill(Integer id, UtilityBillRequest request) {
        UtilityBill utilityBill = utilityBillRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utility bill not found with id: " + id));

        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new EntityNotFoundException("Household not found with id: " + request.getHouseholdId()));

        utilityBill.setHousehold(household);
        utilityBill.setMonthYear(request.getMonthYear());
        utilityBill.setType(request.getType());
        utilityBill.setAmount(request.getAmount());

        return mapToResponse(utilityBillRepository.save(utilityBill));
    }

    @Override
    @Transactional
    public void deleteUtilityBill(Integer id) {
        if (!utilityBillRepository.existsById(id)) {
            throw new EntityNotFoundException("Utility bill not found with id: " + id);
        }
        utilityBillRepository.deleteById(id);
    }

    @Override
    @Transactional
    public UtilityBillResponse markAsPaid(Integer id) {
        UtilityBill utilityBill = utilityBillRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utility bill not found with id: " + id));

        utilityBill.setIsPaid(true);
        utilityBill.setPaidDate(LocalDate.now());

        return mapToResponse(utilityBillRepository.save(utilityBill));
    }

    private UtilityBillResponse mapToResponse(UtilityBill utilityBill) {
        return UtilityBillResponse.builder()
                .id(utilityBill.getId())
                .householdId(utilityBill.getHousehold().getId())
                .monthYear(utilityBill.getMonthYear())
                .type(utilityBill.getType())
                .amount(utilityBill.getAmount())
                .isPaid(utilityBill.getIsPaid())
                .paidDate(utilityBill.getPaidDate())
                .paidBy(utilityBill.getPaidBy())
                .collectedBy(utilityBill.getCollectedBy())
                .createdBy(utilityBill.getCreatedBy())
                .createdAt(utilityBill.getCreatedAt())
                .build();
    }
} 