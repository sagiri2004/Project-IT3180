package com.example.backend.service;

import com.example.backend.dto.request.PopulationChangeRequest;
import com.example.backend.dto.response.PopulationChangeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PopulationChangeService {
	PopulationChangeResponse createPopulationChange(PopulationChangeRequest request);
	PopulationChangeResponse getPopulationChangeById(Integer id);
	Page<PopulationChangeResponse> getAllPopulationChanges(Pageable pageable);
	List<PopulationChangeResponse> getPopulationChangesByResident(Integer residentId);
	List<PopulationChangeResponse> getPopulationChangesByHousehold(Integer householdId);
	List<PopulationChangeResponse> getPendingPopulationChanges();
	PopulationChangeResponse approvePopulationChange(Integer id);
	PopulationChangeResponse rejectPopulationChange(Integer id);
	PopulationChangeResponse updatePopulationChange(Integer id, PopulationChangeRequest request);
	void deletePopulationChange(Integer id);
}