package com.example.backend.service;

import com.example.backend.dto.request.ResidentRequest;
import com.example.backend.dto.response.ResidentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ResidentService {
	ResidentResponse createResident(ResidentRequest request);
	ResidentResponse getResidentById(Integer id);
	Page<ResidentResponse> getAllResidents(Pageable pageable);
	List<ResidentResponse> getResidentsByHousehold(Integer householdId);
	ResidentResponse updateResident(Integer id, ResidentRequest request);
	void deleteResident(Integer id);
	List<ResidentResponse> searchResidents(String keyword);
}