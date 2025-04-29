package com.example.backend.service.impl;

import com.example.backend.dto.request.HouseholdRequest;
import com.example.backend.dto.response.HouseholdResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Household;
import com.example.backend.repository.HouseholdRepository;
import com.example.backend.service.HistoryRecordService;
import com.example.backend.service.HouseholdService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HouseholdServiceImpl implements HouseholdService {

	private final HouseholdRepository householdRepository;
	private final HistoryRecordService historyRecordService;
	private final ObjectMapper objectMapper;

	@Override
	@Transactional
	public HouseholdResponse createHousehold(HouseholdRequest request) {
		String householdCode = request.getHouseholdCode();
		if (householdCode == null || householdCode.isBlank()) {
			householdCode = "HH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
		} else if (householdRepository.findByHouseholdCode(householdCode) != null) {
			throw new BadRequestException("Household code already exists");
		}

		Household household = Household.builder()
				.householdCode(householdCode)
				.apartmentNumber(request.getApartmentNumber())
				.areaM2(request.getAreaM2())
				.address(request.getAddress())
				.ownerName(request.getOwnerName())
				.phoneNumber(request.getPhoneNumber())
				.registrationDate(LocalDateTime.now())
				.createdBy(getCurrentUsername())
				.build();

		household = householdRepository.save(household);

		// Record history
		try {
			String changes = objectMapper.writeValueAsString(request);
			historyRecordService.recordAction(
					"Household",
					household.getId(),
					"CREATE",
					changes,
					getCurrentUsername()
			);
		} catch (JsonProcessingException e) {
			log.error("Error recording history for household creation", e);
		}

		return mapToHouseholdResponse(household);
	}

	@Override
	public HouseholdResponse getHouseholdById(Integer id) {
		return householdRepository.findById(id)
				.map(this::mapToHouseholdResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + id));
	}

	@Override
	public HouseholdResponse getHouseholdByCode(String householdCode) {
		Household household = householdRepository.findByHouseholdCode(householdCode);
		if (household == null) {
			throw new ResourceNotFoundException("Household not found with code: " + householdCode);
		}
		return mapToHouseholdResponse(household);
	}

	@Override
	public Page<HouseholdResponse> getAllHouseholds(Pageable pageable) {
		return householdRepository.findAll(pageable)
				.map(this::mapToHouseholdResponse);
	}

	@Override
	@Transactional
	public HouseholdResponse updateHousehold(Integer id, HouseholdRequest request) {
		Household household = householdRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + id));

		// Capture old state for history
		HouseholdResponse oldState = mapToHouseholdResponse(household);

		if (request.getHouseholdCode() != null && !request.getHouseholdCode().equals(household.getHouseholdCode())) {
			if (householdRepository.findByHouseholdCode(request.getHouseholdCode()) != null) {
				throw new BadRequestException("Household code already exists");
			}
			household.setHouseholdCode(request.getHouseholdCode());
		}

		household.setApartmentNumber(request.getApartmentNumber());
		household.setAreaM2(request.getAreaM2());
		household.setAddress(request.getAddress());
		household.setOwnerName(request.getOwnerName());
		household.setPhoneNumber(request.getPhoneNumber());

		household = householdRepository.save(household);

		// Record history
		try {
			String changes = String.format("Updated from %s to %s",
					objectMapper.writeValueAsString(oldState),
					objectMapper.writeValueAsString(request));

			historyRecordService.recordAction(
					"Household",
					household.getId(),
					"UPDATE",
					changes,
					getCurrentUsername()
			);
		} catch (JsonProcessingException e) {
			log.error("Error recording history for household update", e);
		}

		return mapToHouseholdResponse(household);
	}

	@Override
	@Transactional
	public void deleteHousehold(Integer id) {
		Household household = householdRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + id));

		if (household.getResidents() != null && !household.getResidents().isEmpty()) {
			throw new BadRequestException("Cannot delete household with residents");
		}

		// Record history before deletion
		try {
			historyRecordService.recordAction(
					"Household",
					id,
					"DELETE",
					"Household deleted: " + household.getHouseholdCode(),
					getCurrentUsername()
			);
		} catch (Exception e) {
			log.error("Error recording history for household deletion", e);
		}

		householdRepository.deleteById(id);
	}

	private HouseholdResponse mapToHouseholdResponse(Household household) {
		return HouseholdResponse.builder()
				.id(household.getId())
				.householdCode(household.getHouseholdCode())
				.apartmentNumber(household.getApartmentNumber())
				.areaM2(household.getAreaM2())
				.address(household.getAddress())
				.ownerName(household.getOwnerName())
				.phoneNumber(household.getPhoneNumber())
				.registrationDate(household.getRegistrationDate())
				.residentCount(household.getResidents() != null ? household.getResidents().size() : 0)
				.createdAt(household.getCreatedAt())
				.build();
	}

	private String getCurrentUsername() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return "system";
		}
		return authentication.getName();
	}

	@Override
	public List<HouseholdResponse> searchHouseholds(String keyword) {
		if (keyword == null || keyword.trim().isEmpty()) {
			return new ArrayList<>();
		}

		String searchTerm = "%" + keyword.toLowerCase() + "%";

		List<Household> households = householdRepository.findByHouseholdCodeContainingIgnoreCaseOrApartmentNumberContainingIgnoreCaseOrOwnerNameContainingIgnoreCaseOrAddressContainingIgnoreCase(
				searchTerm, searchTerm, searchTerm, searchTerm);

		return households.stream()
				.map(this::mapToHouseholdResponse)
				.collect(Collectors.toList());
	}

}