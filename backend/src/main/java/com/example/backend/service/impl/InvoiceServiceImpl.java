package com.example.backend.service.impl;

import com.example.backend.dto.request.InvoiceRequest;
import com.example.backend.dto.response.InvoiceResponse;
import com.example.backend.exception.HouseholdNotFoundException;
import com.example.backend.exception.InvoiceNotFoundException;
import com.example.backend.exception.RevenueNotFoundException;
import com.example.backend.model.Household;
import com.example.backend.model.Invoice;
import com.example.backend.model.Revenue;
import com.example.backend.repository.HouseholdRepository;
import com.example.backend.repository.InvoiceRepository;
import com.example.backend.repository.RevenueRepository;
import com.example.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

	private final InvoiceRepository invoiceRepository;
	private final HouseholdRepository householdRepository;
	private final RevenueRepository revenueRepository;

	@Override
	public InvoiceResponse create(InvoiceRequest request) {
		Household household = householdRepository.findById(request.getHouseholdId())
				.orElseThrow(() -> new HouseholdNotFoundException("Household not found with id: " + request.getHouseholdId()));

		Revenue revenue = revenueRepository.findById(request.getRevenueId())
				.orElseThrow(() -> new RevenueNotFoundException("Revenue not found with id: " + request.getRevenueId()));

		Invoice invoice = Invoice.builder()
				.id(UUID.randomUUID().toString())
				.household(household)
				.revenue(revenue)
				.amount(request.getAmount())
				.paymentDate(request.getPaymentDate())
				.status(request.getStatus())
				.build();

		Invoice saved = invoiceRepository.save(invoice);
		return toResponse(saved, "Invoice created successfully.");
	}

	@Override
	public InvoiceResponse update(String id, InvoiceRequest request) {
		Invoice invoice = invoiceRepository.findById(id)
				.orElseThrow(() -> new InvoiceNotFoundException("Invoice not found with id: " + id));

		Household household = householdRepository.findById(request.getHouseholdId())
				.orElseThrow(() -> new HouseholdNotFoundException("Household not found with id: " + request.getHouseholdId()));

		Revenue revenue = revenueRepository.findById(request.getRevenueId())
				.orElseThrow(() -> new RevenueNotFoundException("Revenue not found with id: " + request.getRevenueId()));

		invoice.setHousehold(household);
		invoice.setRevenue(revenue);
		invoice.setAmount(request.getAmount());
		invoice.setPaymentDate(request.getPaymentDate());
		invoice.setStatus(request.getStatus());

		Invoice updated = invoiceRepository.save(invoice);
		return toResponse(updated, "Invoice updated successfully.");
	}

	@Override
	public InvoiceResponse delete(String id) {
		Invoice invoice = invoiceRepository.findById(id)
				.orElseThrow(() -> new InvoiceNotFoundException("Invoice not found with id: " + id));

		invoiceRepository.delete(invoice);
		return InvoiceResponse.builder()
				.message("Invoice deleted successfully.")
				.build();
	}

	@Override
	public InvoiceResponse getById(String id) {
		Invoice invoice = invoiceRepository.findById(id)
				.orElseThrow(() -> new InvoiceNotFoundException("Invoice not found with id: " + id));
		return toResponse(invoice, "Invoice retrieved successfully.");
	}

	@Override
	public List<InvoiceResponse> getAll() {
		return invoiceRepository.findAll().stream()
				.map(invoice -> toResponse(invoice, "Invoice retrieved successfully."))
				.collect(Collectors.toList());
	}

	private InvoiceResponse toResponse(Invoice invoice, String message) {
		return InvoiceResponse.builder()
				.id(invoice.getId())
				.householdId(invoice.getHousehold().getId())
				.revenueId(invoice.getRevenue().getId())
				.amount(invoice.getAmount())
				.paymentDate(invoice.getPaymentDate())
				.status(invoice.getStatus())
				.message(message)
				.build();
	}
}
