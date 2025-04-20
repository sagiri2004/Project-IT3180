package com.example.backend.service;

import com.example.backend.dto.request.RevenueRequest;
import com.example.backend.dto.response.RevenueResponse;

import java.util.List;

public interface RevenueService {
	RevenueResponse create(RevenueRequest request);
	RevenueResponse update(String id, RevenueRequest request);
	RevenueResponse delete(String id);
	List<RevenueResponse> getAll();
	RevenueResponse getById(String id);
}
