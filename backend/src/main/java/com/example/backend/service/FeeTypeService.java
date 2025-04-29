package com.example.backend.service;

import com.example.backend.dto.request.FeeTypeRequest;
import com.example.backend.dto.response.FeeTypeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FeeTypeService {
	FeeTypeResponse createFeeType(FeeTypeRequest request);
	FeeTypeResponse getFeeTypeById(Integer id);
	Page<FeeTypeResponse> getAllFeeTypes(Pageable pageable);
	List<FeeTypeResponse> getRequiredFeeTypes();
	FeeTypeResponse updateFeeType(Integer id, FeeTypeRequest request);
	void deleteFeeType(Integer id);
}