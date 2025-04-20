package com.example.backend.service;

import com.example.backend.dto.request.InvoiceRequest;
import com.example.backend.dto.response.InvoiceResponse;

import java.util.List;

public interface InvoiceService {
	InvoiceResponse create(InvoiceRequest request);
	InvoiceResponse update(String id, InvoiceRequest request);
	InvoiceResponse delete(String id);
	InvoiceResponse getById(String id);
	List<InvoiceResponse> getAll();
}
