package com.example.backend.service;

import com.example.backend.dto.request.UtilityBillRequest;
import com.example.backend.dto.response.UtilityBillResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UtilityBillService {
    Page<UtilityBillResponse> getUtilityBills(Pageable pageable);
    Page<UtilityBillResponse> getUtilityBillsByHousehold(Integer householdId, Pageable pageable);
    Page<UtilityBillResponse> getUtilityBillsByHouseholdAndMonth(Integer householdId, String monthYear, Pageable pageable);
    UtilityBillResponse getUtilityBill(Integer id);
    UtilityBillResponse createUtilityBill(UtilityBillRequest request);
    UtilityBillResponse updateUtilityBill(Integer id, UtilityBillRequest request);
    void deleteUtilityBill(Integer id);
    UtilityBillResponse markAsPaid(Integer id);
} 