package com.example.backend.service;

import com.example.backend.dto.request.FeeCollectionRequest;
import com.example.backend.dto.response.FeeCollectionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;

public interface FeeCollectionService {
	FeeCollectionResponse createFeeCollection(FeeCollectionRequest request);
	FeeCollectionResponse getFeeCollectionById(Integer id);
	Page<FeeCollectionResponse> getAllFeeCollections(Pageable pageable);
	List<FeeCollectionResponse> getFeeCollectionsByHousehold(Integer householdId);
	List<FeeCollectionResponse> getUnpaidFeesByHousehold(Integer householdId);
	List<FeeCollectionResponse> getFeeCollectionsByYearMonth(YearMonth yearMonth);
	Page<FeeCollectionResponse> getFeeCollectionsByYearMonthPaginated(YearMonth yearMonth, Pageable pageable);
	List<FeeCollectionResponse> getUnpaidFeesByYearMonth(YearMonth yearMonth);
	FeeCollectionResponse updateFeeCollection(Integer id, FeeCollectionRequest request);
	FeeCollectionResponse markAsPaid(Integer id, String collectedBy);
	void deleteFeeCollection(Integer id);

	// Generate collection for all households
	void generateMonthlyFeeCollectionsForAllHouseholds(YearMonth yearMonth);

	// Get stats
	Double getTotalCollectedAmountByYearMonth(YearMonth yearMonth);
	Double getTotalExpectedAmountByYearMonth(YearMonth yearMonth);
	Map<String, Double> getCollectionStatsByYearMonth(YearMonth yearMonth);
}