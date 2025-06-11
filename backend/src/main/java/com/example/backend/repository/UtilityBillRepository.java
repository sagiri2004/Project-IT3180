package com.example.backend.repository;

import com.example.backend.model.UtilityBill;
import com.example.backend.model.enums.UtilityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UtilityBillRepository extends JpaRepository<UtilityBill, Integer> {
    List<UtilityBill> findByHouseholdId(Integer householdId);
    List<UtilityBill> findByHouseholdIdAndMonthYear(Integer householdId, String monthYear);
    List<UtilityBill> findByHouseholdIdAndTypeAndMonthYear(Integer householdId, UtilityType type, String monthYear);
    boolean existsByHouseholdIdAndTypeAndMonthYear(Integer householdId, UtilityType type, String monthYear);
    Page<UtilityBill> findByHouseholdId(Integer householdId, Pageable pageable);
    Page<UtilityBill> findByHouseholdIdAndMonthYear(Integer householdId, String monthYear, Pageable pageable);
} 