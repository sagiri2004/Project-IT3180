package com.example.backend.service.impl;

import com.example.backend.dto.request.PopulationChangeRequest;
import com.example.backend.dto.response.PopulationChangeResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Household;
import com.example.backend.model.PopulationChange;
import com.example.backend.model.Resident;
import com.example.backend.repository.HouseholdRepository;
import com.example.backend.repository.PopulationChangeRepository;
import com.example.backend.repository.ResidentRepository;
import com.example.backend.service.HistoryRecordService;
import com.example.backend.service.PopulationChangeService;
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
public class PopulationChangeServiceImpl implements PopulationChangeService {

	private final PopulationChangeRepository populationChangeRepository;
	private final ResidentRepository residentRepository;
	private final HouseholdRepository householdRepository;
	private final HistoryRecordService historyRecordService;
	private final ObjectMapper objectMapper;

	@Override
	@Transactional
	public PopulationChangeResponse createPopulationChange(PopulationChangeRequest request) {
		// Validate resident exists
		Resident resident = residentRepository.findById(request.getResidentId())
				.orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + request.getResidentId()));

		// Determine household (from request or resident's household)
		Household household;
		if (request.getHouseholdId() != null) {
			household = householdRepository.findById(request.getHouseholdId())
					.orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + request.getHouseholdId()));
		} else {
			household = resident.getHousehold();
		}

		// Validate date range
		if (request.getEndDate() != null && request.getStartDate().isAfter(request.getEndDate())) {
			throw new BadRequestException("Start date must be before end date");
		}

		// Create new population change record
		PopulationChange populationChange = PopulationChange.builder()
				.resident(resident)
				.household(household)
				.changeType(request.getChangeType())
				.startDate(request.getStartDate())
				.endDate(request.getEndDate())
				.reason(request.getReason())
				.destinationAddress(request.getDestinationAddress())
				.sourceAddress(request.getSourceAddress())
				.isApproved(false)
				.createdBy(getCurrentUsername())
				.build();

		// Save to database
		populationChange = populationChangeRepository.save(populationChange);

		// Record history
		try {
			String changes = objectMapper.writeValueAsString(request);
			historyRecordService.recordAction(
					"PopulationChange",
					populationChange.getId(),
					"CREATE",
					changes,
					getCurrentUsername()
			);
		} catch (JsonProcessingException e) {
			log.error("Error recording history for population change creation", e);
		}

		return mapToPopulationChangeResponse(populationChange);
	}

	@Override
	public PopulationChangeResponse getPopulationChangeById(Integer id) {
		return populationChangeRepository.findById(id)
				.map(this::mapToPopulationChangeResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Population change not found with id: " + id));
	}

	@Override
	public Page<PopulationChangeResponse> getAllPopulationChanges(Pageable pageable) {
		return populationChangeRepository.findAll(pageable)
				.map(this::mapToPopulationChangeResponse);
	}

	@Override
	public List<PopulationChangeResponse> getPopulationChangesByResident(Integer residentId) {
		if (!residentRepository.existsById(residentId)) {
			throw new ResourceNotFoundException("Resident not found with id: " + residentId);
		}

		return populationChangeRepository.findByResidentId(residentId).stream()
				.map(this::mapToPopulationChangeResponse)
				.collect(Collectors.toList());
	}

	@Override
	public List<PopulationChangeResponse> getPopulationChangesByHousehold(Integer householdId) {
		if (!householdRepository.existsById(householdId)) {
			throw new ResourceNotFoundException("Household not found with id: " + householdId);
		}

		return populationChangeRepository.findByHouseholdId(householdId).stream()
				.map(this::mapToPopulationChangeResponse)
				.collect(Collectors.toList());
	}

	@Override
	public List<PopulationChangeResponse> getPendingPopulationChanges() {
		return populationChangeRepository.findByIsApproved(false).stream()
				.map(this::mapToPopulationChangeResponse)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public PopulationChangeResponse approvePopulationChange(Integer id) {
		PopulationChange populationChange = populationChangeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Population change not found with id: " + id));

		if (populationChange.getIsApproved()) {
			throw new BadRequestException("Population change is already approved");
		}

		populationChange.setIsApproved(true);
		populationChange = populationChangeRepository.save(populationChange);

		// Record history
		try {
			historyRecordService.recordAction(
					"PopulationChange",
					populationChange.getId(),
					"APPROVE",
					"Population change approved",
					getCurrentUsername()
			);
		} catch (Exception e) {
			log.error("Error recording history for population change approval", e);
		}

		return mapToPopulationChangeResponse(populationChange);
	}

	@Override
	@Transactional
	public PopulationChangeResponse rejectPopulationChange(Integer id) {
		PopulationChange populationChange = populationChangeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Population change not found with id: " + id));

		if (populationChange.getIsApproved()) {
			throw new BadRequestException("Cannot reject an already approved population change");
		}

		// Store response before deletion for return
		PopulationChangeResponse response = mapToPopulationChangeResponse(populationChange);

		// Record history before deletion
		try {
			historyRecordService.recordAction(
					"PopulationChange",
					populationChange.getId(),
					"REJECT",
					"Population change rejected",
					getCurrentUsername()
			);
		} catch (Exception e) {
			log.error("Error recording history for population change rejection", e);
		}

		// Delete the record
		populationChangeRepository.delete(populationChange);

		return response;
	}

	@Override
	@Transactional
	public PopulationChangeResponse updatePopulationChange(Integer id, PopulationChangeRequest request) {
		PopulationChange populationChange = populationChangeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Population change not found with id: " + id));

		if (populationChange.getIsApproved()) {
			throw new BadRequestException("Cannot update an approved population change");
		}

		// Capture old state for history
		PopulationChangeResponse oldState = mapToPopulationChangeResponse(populationChange);

		// Update resident if changed
		if (!request.getResidentId().equals(populationChange.getResident().getId())) {
			Resident resident = residentRepository.findById(request.getResidentId())
					.orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + request.getResidentId()));
			populationChange.setResident(resident);
		}

		// Update household if provided and changed
		if (request.getHouseholdId() != null &&
				!request.getHouseholdId().equals(populationChange.getHousehold().getId())) {
			Household household = householdRepository.findById(request.getHouseholdId())
					.orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + request.getHouseholdId()));
			populationChange.setHousehold(household);
		}

		// Validate date range
		if (request.getEndDate() != null && request.getStartDate().isAfter(request.getEndDate())) {
			throw new BadRequestException("Start date must be before end date");
		}

		// Update other fields
		populationChange.setChangeType(request.getChangeType());
		populationChange.setStartDate(request.getStartDate());
		populationChange.setEndDate(request.getEndDate());
		populationChange.setReason(request.getReason());
		populationChange.setDestinationAddress(request.getDestinationAddress());
		populationChange.setSourceAddress(request.getSourceAddress());

		// Save changes
		populationChange = populationChangeRepository.save(populationChange);

		// Record history
		try {
			String changes = String.format("Updated from %s to %s",
					objectMapper.writeValueAsString(oldState),
					objectMapper.writeValueAsString(request));

			historyRecordService.recordAction(
					"PopulationChange",
					populationChange.getId(),
					"UPDATE",
					changes,
					getCurrentUsername()
			);
		} catch (JsonProcessingException e) {
			log.error("Error recording history for population change update", e);
		}

		return mapToPopulationChangeResponse(populationChange);
	}

	@Override
	@Transactional
	public void deletePopulationChange(Integer id) {
		PopulationChange populationChange = populationChangeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Population change not found with id: " + id));

		if (populationChange.getIsApproved()) {
			throw new BadRequestException("Cannot delete an approved population change");
		}

		// Record history before deletion
		try {
			historyRecordService.recordAction(
					"PopulationChange",
					populationChange.getId(),
					"DELETE",
					"Population change deleted",
					getCurrentUsername()
			);
		} catch (Exception e) {
			log.error("Error recording history for population change deletion", e);
		}

		populationChangeRepository.deleteById(id);
	}

	private PopulationChangeResponse mapToPopulationChangeResponse(PopulationChange populationChange) {
		return PopulationChangeResponse.builder()
				.id(populationChange.getId())
				.residentId(populationChange.getResident().getId())
				.residentName(populationChange.getResident().getFullName())
				.householdId(populationChange.getHousehold().getId())
				.householdCode(populationChange.getHousehold().getHouseholdCode())
				.changeType(populationChange.getChangeType())
				.startDate(populationChange.getStartDate())
				.endDate(populationChange.getEndDate())
				.reason(populationChange.getReason())
				.destinationAddress(populationChange.getDestinationAddress())
				.sourceAddress(populationChange.getSourceAddress())
				.isApproved(populationChange.getIsApproved())
				.createdAt(populationChange.getCreatedAt())
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