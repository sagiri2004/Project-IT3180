package com.example.backend.service.impl;

import com.example.backend.dto.request.FeeTypeRequest;
import com.example.backend.dto.response.FeeTypeResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.FeeCollection;
import com.example.backend.model.FeeType;
import com.example.backend.repository.FeeCollectionRepository;
import com.example.backend.repository.FeeTypeRepository;
import com.example.backend.service.FeeTypeService;
import com.example.backend.service.HistoryRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeeTypeServiceImpl implements FeeTypeService {

	private final FeeTypeRepository feeTypeRepository;
	private final FeeCollectionRepository feeCollectionRepository;
	private final HistoryRecordService historyRecordService;

	@Override
	@Transactional
	public FeeTypeResponse createFeeType(FeeTypeRequest request) {
		// Check if fee type with the same name already exists
		Optional<FeeType> existingFeeType = feeTypeRepository.findByName(request.getName());
		if (existingFeeType.isPresent()) {
			throw new BadRequestException("Fee type with name " + request.getName() + " already exists");
		}

		FeeType feeType = FeeType.builder()
				.name(request.getName())
				.description(request.getDescription())
				.pricePerM2(request.getPricePerM2())
				.isPerM2(request.getIsPerM2())
				.isRequired(request.getIsRequired())
				.createdBy(getCurrentUsername())
				.build();

		feeType = feeTypeRepository.save(feeType);

		// Record history
		historyRecordService.recordAction("FeeType", feeType.getId(), "CREATE");

		return mapToFeeTypeResponse(feeType);
	}

	@Override
	public FeeTypeResponse getFeeTypeById(Integer id) {
		return feeTypeRepository.findById(id)
				.map(this::mapToFeeTypeResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Fee type not found with id: " + id));
	}

	@Override
	public Page<FeeTypeResponse> getAllFeeTypes(Pageable pageable) {
		return feeTypeRepository.findAll(pageable)
				.map(this::mapToFeeTypeResponse);
	}

	@Override
	public List<FeeTypeResponse> getRequiredFeeTypes() {
		return feeTypeRepository.findByIsRequired(true).stream()
				.map(this::mapToFeeTypeResponse)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public FeeTypeResponse updateFeeType(Integer id, FeeTypeRequest request) {
		FeeType feeType = feeTypeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Fee type not found with id: " + id));

		// Check if name is being changed and if it already exists
		if (!feeType.getName().equals(request.getName())) {
			Optional<FeeType> existingFeeType = feeTypeRepository.findByName(request.getName());
			if (existingFeeType.isPresent()) {
				throw new BadRequestException("Fee type with name " + request.getName() + " already exists");
			}
		}

		// Store old values for history
		String oldValues = "Name: " + feeType.getName() +
				", Description: " + feeType.getDescription() +
				", PricePerM2: " + feeType.getPricePerM2() +
				", IsPerM2: " + feeType.getIsPerM2() +
				", IsRequired: " + feeType.getIsRequired();

		// Update the fee type
		feeType.setName(request.getName());
		feeType.setDescription(request.getDescription());
		feeType.setPricePerM2(request.getPricePerM2());
		feeType.setIsPerM2(request.getIsPerM2());
		feeType.setIsRequired(request.getIsRequired());

		feeType = feeTypeRepository.save(feeType);

		// Record history
		historyRecordService.recordAction("FeeType", feeType.getId(), "UPDATE");

		return mapToFeeTypeResponse(feeType);
	}

	@Override
	@Transactional
	public void deleteFeeType(Integer id) {
		FeeType feeType = feeTypeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Fee type not found with id: " + id));

		// Check if there are fee collections using this fee type
		List<FeeCollection> collections = feeCollectionRepository.findByFeeTypeId(id);
		if (!collections.isEmpty()) {
			throw new BadRequestException("Cannot delete fee type as it is used in fee collections");
		}

		feeTypeRepository.deleteById(id);

		// Record history
		historyRecordService.recordAction("FeeType", id, "DELETE");
	}

	private FeeTypeResponse mapToFeeTypeResponse(FeeType feeType) {
		return FeeTypeResponse.builder()
				.id(feeType.getId())
				.name(feeType.getName())
				.description(feeType.getDescription())
				.pricePerM2(feeType.getPricePerM2())
				.isPerM2(feeType.getIsPerM2())
				.isRequired(feeType.getIsRequired())
				.createdBy(feeType.getCreatedBy())
				.createdAt(feeType.getCreatedAt())
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