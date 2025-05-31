package com.example.backend.service.impl;

import com.example.backend.dto.request.ResidentRequest;
import com.example.backend.dto.response.ResidentResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Household;
import com.example.backend.model.Resident;
import com.example.backend.model.enums.RelationshipType;
import com.example.backend.repository.HouseholdRepository;
import com.example.backend.repository.ResidentRepository;
import com.example.backend.service.HistoryRecordService;
import com.example.backend.service.ResidentService;
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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResidentServiceImpl implements ResidentService {

	private final ResidentRepository residentRepository;
	private final HouseholdRepository householdRepository;
	private final HistoryRecordService historyRecordService;
	private final ObjectMapper objectMapper;

	@Override
	@Transactional
	public ResidentResponse createResident(ResidentRequest request) {
		Household household = householdRepository.findById(request.getHouseholdId())
				.orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + request.getHouseholdId()));

		if (request.getIdCardNumber() != null && !request.getIdCardNumber().isBlank()) {
			if (residentRepository.findByIdCardNumber(request.getIdCardNumber()) != null) {
				throw new BadRequestException("Resident with this ID card number already exists");
			}
		}

		if (request.getIsOwner()) {
			// Check if there's already an owner in this household
			List<Resident> residents = residentRepository.findByHouseholdId(household.getId());
			boolean ownerExists = residents.stream().anyMatch(Resident::getIsOwner);
			if (ownerExists) {
				throw new BadRequestException("This household already has an owner");
			}

			// Owner must have relationship type OWNER
			if (request.getRelationshipWithOwner() != RelationshipType.OWNER) {
				throw new BadRequestException("Owner must have relationship type OWNER");
			}
		}

		Resident resident = Resident.builder()
				.household(household)
				.fullName(request.getFullName())
				.dateOfBirth(request.getDateOfBirth())
				.gender(request.getGender())
				.idCardNumber(request.getIdCardNumber())
				.relationshipWithOwner(request.getRelationshipWithOwner())
				.isOwner(request.getIsOwner())
				.createdBy(getCurrentUsername())
				.build();

		resident = residentRepository.save(resident);

		// Record history
		historyRecordService.recordAction("Resident", resident.getId(), "CREATE");

		return mapToResidentResponse(resident);
	}

	@Override
	public ResidentResponse getResidentById(Integer id) {
		return residentRepository.findById(id)
				.map(this::mapToResidentResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + id));
	}

	@Override
	public Page<ResidentResponse> getAllResidents(Pageable pageable) {
		return residentRepository.findAll(pageable)
				.map(this::mapToResidentResponse);
	}

	@Override
	public List<ResidentResponse> getResidentsByHousehold(Integer householdId) {
		if (!householdRepository.existsById(householdId)) {
			throw new ResourceNotFoundException("Household not found with id: " + householdId);
		}

		return residentRepository.findByHouseholdId(householdId).stream()
				.map(this::mapToResidentResponse)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public ResidentResponse updateResident(Integer id, ResidentRequest request) {
		Resident resident = residentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + id));

		// Capture old state for history
		ResidentResponse oldState = mapToResidentResponse(resident);

		Household household;
		if (!request.getHouseholdId().equals(resident.getHousehold().getId())) {
			household = householdRepository.findById(request.getHouseholdId())
					.orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + request.getHouseholdId()));
			resident.setHousehold(household);
		} else {
			household = resident.getHousehold();
		}

		if (request.getIdCardNumber() != null && !request.getIdCardNumber().equals(resident.getIdCardNumber())) {
			Resident existingResident = residentRepository.findByIdCardNumber(request.getIdCardNumber());
			if (existingResident != null && !existingResident.getId().equals(resident.getId())) {
				throw new BadRequestException("Resident with this ID card number already exists");
			}
			resident.setIdCardNumber(request.getIdCardNumber());
		}

		if (request.getIsOwner() && !resident.getIsOwner()) {
			// Check if there's already an owner in this household
			List<Resident> residents = residentRepository.findByHouseholdId(household.getId());
			final Integer residentId = resident.getId();

			boolean ownerExists = residents.stream()
					.filter(r -> !r.getId().equals(residentId))
					.filter(r -> r.getIsOwner() != null)
					.anyMatch(Resident::getIsOwner);
			if (ownerExists) {
				throw new BadRequestException("This household already has an owner");
			}

			// Owner must have relationship type OWNER
			if (request.getRelationshipWithOwner() != RelationshipType.OWNER) {
				throw new BadRequestException("Owner must have relationship type OWNER");
			}
		}

		resident.setFullName(request.getFullName());
		resident.setDateOfBirth(request.getDateOfBirth());
		resident.setGender(request.getGender());
		resident.setRelationshipWithOwner(request.getRelationshipWithOwner());
		resident.setIsOwner(request.getIsOwner());

		resident = residentRepository.save(resident);

		// Record history
		historyRecordService.recordAction("Resident", resident.getId(), "UPDATE");

		return mapToResidentResponse(resident);
	}

	@Override
	@Transactional
	public void deleteResident(Integer id) {
		Resident resident = residentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + id));

		// Check if this is the owner of a household
		if (resident.getIsOwner()) {
			throw new BadRequestException("Cannot delete a resident who is the owner of a household");
		}

		// Check if resident has population changes
		if (resident.getPopulationChanges() != null && !resident.getPopulationChanges().isEmpty()) {
			throw new BadRequestException("Cannot delete a resident with population changes. Delete the changes first.");
		}

		residentRepository.deleteById(id);

		// Record history
		historyRecordService.recordAction("Resident", id, "DELETE");
	}

	@Override
	public List<ResidentResponse> searchResidents(String keyword) {
		// Implementation will depend on additional repository methods for search
		// For simplicity, let's assume we have all residents and filter in memory
		return residentRepository.findAll().stream()
				.filter(r -> r.getFullName().contains(keyword) ||
						(r.getIdCardNumber() != null && r.getIdCardNumber().contains(keyword)))
				.map(this::mapToResidentResponse)
				.collect(Collectors.toList());
	}

	private ResidentResponse mapToResidentResponse(Resident resident) {
		return ResidentResponse.builder()
				.id(resident.getId())
				.householdId(resident.getHousehold().getId())
				.householdCode(resident.getHousehold().getHouseholdCode())
				.fullName(resident.getFullName())
				.dateOfBirth(resident.getDateOfBirth())
				.gender(resident.getGender())
				.idCardNumber(resident.getIdCardNumber())
				.relationshipWithOwner(resident.getRelationshipWithOwner())
				.isOwner(resident.getIsOwner())
				.createdAt(resident.getCreatedAt())
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