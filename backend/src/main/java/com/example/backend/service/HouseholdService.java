package com.example.backend.service;

import com.example.backend.dto.request.HouseholdRequest;
import com.example.backend.dto.response.HouseholdResponse;

import java.util.List;

public interface HouseholdService {
	HouseholdResponse create(HouseholdRequest request);
	HouseholdResponse update(String id, HouseholdRequest request);
	HouseholdResponse delete(String id);
	HouseholdResponse getById(String id);
	List<HouseholdResponse> getAll();
}
