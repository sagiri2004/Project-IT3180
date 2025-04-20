package com.example.backend.service.impl;

import com.example.backend.dto.request.HouseholdRequest;
import com.example.backend.dto.response.HouseholdResponse;
import com.example.backend.exception.HouseholdNotFoundException;
import com.example.backend.model.Household;
import com.example.backend.repository.HouseholdRepository;
import com.example.backend.service.HouseholdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HouseholdServiceImpl implements HouseholdService {

	private final HouseholdRepository repository;

	@Override
	public HouseholdResponse create(HouseholdRequest request) {
		Household household = Household.builder()
				.id(UUID.randomUUID().toString())
				.address(request.getAddress())
				.area(request.getArea())
				.memberCount(request.getMemberCount())
				.createdBy(request.getCreatedBy())
				.build();

		Household saved = repository.save(household);

		return buildResponse(saved, "Household created successfully.");
	}

	@Override
	public HouseholdResponse update(String id, HouseholdRequest request) {
		Household household = repository.findById(id)
				.orElseThrow(() -> new HouseholdNotFoundException("Household not found with id: " + id));

		household.setAddress(request.getAddress());
		household.setArea(request.getArea());
		household.setMemberCount(request.getMemberCount());

		Household updated = repository.save(household);
		return buildResponse(updated, "Household updated successfully.");
	}

	@Override
	public HouseholdResponse delete(String id) {
		Household household = repository.findById(id)
				.orElseThrow(() -> new HouseholdNotFoundException("Household not found with id: " + id));

		repository.deleteById(id);
		return HouseholdResponse.builder()
				.message("Household deleted successfully.")
				.build();
	}

	@Override
	public HouseholdResponse getById(String id) {
		Household household = repository.findById(id)
				.orElseThrow(() -> new HouseholdNotFoundException("Household not found with id: " + id));

		return buildResponse(household, "Household retrieved successfully.");
	}

	@Override
	public List<HouseholdResponse> getAll() {
		return repository.findAll().stream()
				.map(h -> buildResponse(h, "Household retrieved successfully."))
				.collect(Collectors.toList());
	}

	private HouseholdResponse buildResponse(Household h, String message) {
		return HouseholdResponse.builder()
				.id(h.getId())
				.address(h.getAddress())
				.area(h.getArea())
				.memberCount(h.getMemberCount())
				.createdBy(h.getCreatedBy())
				.createdAt(h.getCreatedAt().toString())
				.message(message)
				.build();
	}
}
