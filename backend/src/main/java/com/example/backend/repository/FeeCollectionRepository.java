package com.example.backend.repository;

import com.example.backend.model.FeeCollection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.List;

@Repository
public interface FeeCollectionRepository extends JpaRepository<FeeCollection, Integer> {
	List<FeeCollection> findByHouseholdId(Integer householdId);
	List<FeeCollection> findByHouseholdIdAndIsPaid(Integer householdId, Boolean isPaid);
	List<FeeCollection> findByYearMonth(YearMonth yearMonth);
	List<FeeCollection> findByYearMonthAndIsPaid(YearMonth yearMonth, Boolean isPaid);
	List<FeeCollection> findByFeeTypeId(Integer feeTypeId);
	List<FeeCollection> findByHouseholdIdAndYearMonth(Integer householdId, YearMonth yearMonth);

	@Query("SELECT SUM(f.amount) FROM FeeCollection f WHERE f.yearMonth = ?1 AND f.isPaid = true")
	Double getTotalCollectedAmountByYearMonth(YearMonth yearMonth);

	@Query("SELECT SUM(f.amount) FROM FeeCollection f WHERE f.yearMonth = ?1")
	Double getTotalExpectedAmountByYearMonth(YearMonth yearMonth);

	Page<FeeCollection> findByYearMonthOrderByHouseholdIdAsc(YearMonth yearMonth, Pageable pageable);
}