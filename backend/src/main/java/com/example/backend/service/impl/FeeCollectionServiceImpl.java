package com.example.backend.service.impl;

import com.example.backend.dto.request.FeeCollectionRequest;
import com.example.backend.dto.response.FeeCollectionResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.FeeCollection;
import com.example.backend.model.FeeType;
import com.example.backend.model.Household;
import com.example.backend.repository.FeeCollectionRepository;
import com.example.backend.repository.FeeTypeRepository;
import com.example.backend.repository.HouseholdRepository;
import com.example.backend.service.FeeCollectionService;
import com.example.backend.service.HistoryRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeeCollectionServiceImpl implements FeeCollectionService {

	private final FeeCollectionRepository feeCollectionRepository;
	private final HouseholdRepository householdRepository;
	private final FeeTypeRepository feeTypeRepository;
	private final HistoryRecordService historyRecordService;

	@Override
	@Transactional
	public FeeCollectionResponse createFeeCollection(FeeCollectionRequest request) {
		// Validate household and fee type
		Household household = householdRepository.findById(request.getHouseholdId())
				.orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + request.getHouseholdId()));

		FeeType feeType = feeTypeRepository.findById(request.getFeeTypeId())
				.orElseThrow(() -> new ResourceNotFoundException("Fee type not found with id: " + request.getFeeTypeId()));

		// Check if collection already exists for this household, fee type, and month
		List<FeeCollection> existingCollections = feeCollectionRepository
				.findByHouseholdIdAndYearMonth(request.getHouseholdId(), request.getYearMonth());

		for (FeeCollection existing : existingCollections) {
			if (existing.getFeeType().getId().equals(request.getFeeTypeId())) {
				throw new BadRequestException("Fee collection already exists for this household, fee type, and month");
			}
		}

		// Calculate amount if not provided and fee is per m2
		Double amount = request.getAmount();
		if (amount == null && feeType.getIsPerM2()) {
			amount = household.getAreaM2() * feeType.getPricePerM2();
		} else if (amount == null) {
			amount = feeType.getPricePerM2(); // Use flat rate if not per m2
		}

		FeeCollection feeCollection = FeeCollection.builder()
				.household(household)
				.feeType(feeType)
				.yearMonth(request.getYearMonth())
				.amount(amount)
				.isPaid(request.getIsPaid() != null ? request.getIsPaid() : false)
				.paidDate(request.getPaidDate())
				.paidBy(request.getPaidBy())
				.collectedBy(request.getCollectedBy())
				.createdBy(getCurrentUsername())
				.build();

		feeCollection = feeCollectionRepository.save(feeCollection);

		// Record history
		historyRecordService.recordAction("FeeCollection", feeCollection.getId(), "CREATE");

		return mapToFeeCollectionResponse(feeCollection);
	}

	@Override
	public FeeCollectionResponse getFeeCollectionById(Integer id) {
		return feeCollectionRepository.findById(id)
				.map(this::mapToFeeCollectionResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Fee collection not found with id: " + id));
	}

	@Override
	public Page<FeeCollectionResponse> getAllFeeCollections(Pageable pageable) {
		return feeCollectionRepository.findAll(pageable)
				.map(this::mapToFeeCollectionResponse);
	}

	@Override
	public List<FeeCollectionResponse> getFeeCollectionsByHousehold(Integer householdId) {
		if (!householdRepository.existsById(householdId)) {
			throw new ResourceNotFoundException("Household not found with id: " + householdId);
		}

		return feeCollectionRepository.findByHouseholdId(householdId).stream()
				.map(this::mapToFeeCollectionResponse)
				.collect(Collectors.toList());
	}

	@Override
	public List<FeeCollectionResponse> getUnpaidFeesByHousehold(Integer householdId) {
		if (!householdRepository.existsById(householdId)) {
			throw new ResourceNotFoundException("Household not found with id: " + householdId);
		}

		return feeCollectionRepository.findByHouseholdIdAndIsPaid(householdId, false).stream()
				.map(this::mapToFeeCollectionResponse)
				.collect(Collectors.toList());
	}

	@Override
	public List<FeeCollectionResponse> getFeeCollectionsByYearMonth(YearMonth yearMonth) {
		return feeCollectionRepository.findByYearMonth(yearMonth).stream()
				.map(this::mapToFeeCollectionResponse)
				.collect(Collectors.toList());
	}

	@Override
	public Page<FeeCollectionResponse> getFeeCollectionsByYearMonthPaginated(YearMonth yearMonth, Pageable pageable) {
		return feeCollectionRepository.findByYearMonthOrderByHouseholdIdAsc(yearMonth, pageable)
				.map(this::mapToFeeCollectionResponse);
	}

	@Override
	public List<FeeCollectionResponse> getUnpaidFeesByYearMonth(YearMonth yearMonth) {
		return feeCollectionRepository.findByYearMonthAndIsPaid(yearMonth, false).stream()
				.map(this::mapToFeeCollectionResponse)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public FeeCollectionResponse updateFeeCollection(Integer id, FeeCollectionRequest request) {
		FeeCollection feeCollection = feeCollectionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Fee collection not found with id: " + id));

		// Store old values for history
		String oldValues = "Amount: " + feeCollection.getAmount() +
				", IsPaid: " + feeCollection.getIsPaid();

		// Update only allowed fields (amount and payment status)
		if (request.getAmount() != null) {
			feeCollection.setAmount(request.getAmount());
		}

		if (request.getIsPaid() != null) {
			feeCollection.setIsPaid(request.getIsPaid());

			// If marking as paid, update related fields
			if (request.getIsPaid() && !feeCollection.getIsPaid()) {
				feeCollection.setPaidDate(request.getPaidDate() != null ? request.getPaidDate() : LocalDate.now());
				feeCollection.setPaidBy(request.getPaidBy());
				feeCollection.setCollectedBy(request.getCollectedBy());
			} else if (!request.getIsPaid()) {
				// If marking as unpaid, clear payment fields
				feeCollection.setPaidDate(null);
				feeCollection.setPaidBy(null);
				feeCollection.setCollectedBy(null);
			}
		}

		feeCollection = feeCollectionRepository.save(feeCollection);

		// Record history
		historyRecordService.recordAction("FeeCollection", feeCollection.getId(), "UPDATE");

		return mapToFeeCollectionResponse(feeCollection);
	}

	@Override
	@Transactional
	public FeeCollectionResponse markAsPaid(Integer id, String collectedBy) {
		FeeCollection feeCollection = feeCollectionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Fee collection not found with id: " + id));

		if (feeCollection.getIsPaid()) {
			throw new BadRequestException("Fee collection is already marked as paid");
		}

		feeCollection.setIsPaid(true);
		feeCollection.setPaidDate(LocalDate.now());
		feeCollection.setCollectedBy(collectedBy);

		feeCollection = feeCollectionRepository.save(feeCollection);

		return mapToFeeCollectionResponse(feeCollection);
	}

	@Override
	@Transactional
	public void deleteFeeCollection(Integer id) {
		FeeCollection feeCollection = feeCollectionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Fee collection not found with id: " + id));

		feeCollectionRepository.deleteById(id);

		// Record history
		historyRecordService.recordAction("FeeCollection", id, "DELETE");
	}

	@Override
	@Transactional
	public void generateMonthlyFeeCollectionsForAllHouseholds(YearMonth yearMonth) {
		log.info("Generating monthly fee collections for all households for {}", yearMonth);

		// Get all required fee types
		List<FeeType> requiredFeeTypes = feeTypeRepository.findByIsRequired(true);
		if (requiredFeeTypes.isEmpty()) {
			log.warn("No required fee types found for monthly generation");
			return;
		}

		// Get all households
		List<Household> households = householdRepository.findAll();
		if (households.isEmpty()) {
			log.warn("No households found for monthly fee generation");
			return;
		}

		int generatedCount = 0;

		// For each household, create fee collections for each required fee type
		for (Household household : households) {
			for (FeeType feeType : requiredFeeTypes) {
				// Check if collection already exists for this household, fee type, and month
				List<FeeCollection> existingCollections = feeCollectionRepository
						.findByHouseholdIdAndYearMonth(household.getId(), yearMonth);

				boolean exists = existingCollections.stream()
						.anyMatch(fee -> fee.getFeeType().getId().equals(feeType.getId()));

				if (!exists) {
					// Calculate fee amount
					Double amount;
					if (feeType.getIsPerM2()) {
						amount = household.getAreaM2() * feeType.getPricePerM2();
					} else {
						amount = feeType.getPricePerM2(); // Flat rate
					}

					// Create new fee collection
					FeeCollection feeCollection = FeeCollection.builder()
							.household(household)
							.feeType(feeType)
							.yearMonth(yearMonth)
							.amount(amount)
							.isPaid(false)
							.createdBy("system")
							.build();

					feeCollectionRepository.save(feeCollection);
					generatedCount++;
				}
			}
		}

		log.info("Generated {} fee collections for {} households and {} required fee types for {}",
				generatedCount, households.size(), requiredFeeTypes.size(), yearMonth);

	}

	@Override
	public Double getTotalCollectedAmountByYearMonth(YearMonth yearMonth) {
		Double amount = feeCollectionRepository.getTotalCollectedAmountByYearMonth(yearMonth);
		return amount != null ? amount : 0.0;
	}

	@Override
	public Double getTotalExpectedAmountByYearMonth(YearMonth yearMonth) {
		Double amount = feeCollectionRepository.getTotalExpectedAmountByYearMonth(yearMonth);
		return amount != null ? amount : 0.0;
	}

	@Override
	public Map<String, Double> getCollectionStatsByYearMonth(YearMonth yearMonth) {
		Map<String, Double> stats = new HashMap<>();

		Double expectedAmount = getTotalExpectedAmountByYearMonth(yearMonth);
		Double collectedAmount = getTotalCollectedAmountByYearMonth(yearMonth);
		Double remainingAmount = expectedAmount - collectedAmount;
		Double collectionRate = expectedAmount > 0 ? (collectedAmount / expectedAmount) * 100 : 0.0;

		stats.put("expectedAmount", expectedAmount);
		stats.put("collectedAmount", collectedAmount);
		stats.put("remainingAmount", remainingAmount);
		stats.put("collectionRate", collectionRate);

		return stats;
	}

	private FeeCollectionResponse mapToFeeCollectionResponse(FeeCollection feeCollection) {
		Household household = feeCollection.getHousehold();
		FeeType feeType = feeCollection.getFeeType();

		return FeeCollectionResponse.builder()
				.id(feeCollection.getId())
				.householdId(household.getId())
				.householdCode(household.getHouseholdCode())
				.apartmentNumber(household.getApartmentNumber())
				.feeTypeId(feeType.getId())
				.feeTypeName(feeType.getName())
				.yearMonth(feeCollection.getYearMonth())
				.amount(feeCollection.getAmount())
				.isPaid(feeCollection.getIsPaid())
				.paidDate(feeCollection.getPaidDate())
				.paidBy(feeCollection.getPaidBy())
				.collectedBy(feeCollection.getCollectedBy())
				.createdBy(feeCollection.getCreatedBy())
				.createdAt(feeCollection.getCreatedAt())
				.build();
	}

	private String getCurrentUsername() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return "system";
		}
		return authentication.getName();
	}
}