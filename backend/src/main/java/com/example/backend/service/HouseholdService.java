package com.example.backend.service;

import com.example.backend.dto.request.HouseholdRequest;
import com.example.backend.dto.response.HouseholdResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface HouseholdService {
	HouseholdResponse createHousehold(HouseholdRequest request);
	HouseholdResponse getHouseholdById(Integer id);
	HouseholdResponse getHouseholdByCode(String householdCode);
	Page<HouseholdResponse> getAllHouseholds(Pageable pageable);
	HouseholdResponse updateHousehold(Integer id, HouseholdRequest request);
	void deleteHousehold(Integer id);
	List<HouseholdResponse> searchHouseholds(String keyword);
}