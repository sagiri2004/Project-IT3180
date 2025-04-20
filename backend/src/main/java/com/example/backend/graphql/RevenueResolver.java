package com.example.backend.graphql;

import com.example.backend.model.*;
import com.example.backend.model.enums.InvoiceStatus;
import com.example.backend.repository.InvoiceRepository;
import com.example.backend.repository.RevenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class RevenueResolver {

	private final RevenueRepository revenueRepo;
	private final InvoiceRepository invoiceRepo;

	@QueryMapping(name = "queryRevenues")
	public List<Revenue> queryRevenues(
			@Argument Optional<String> keyword,
			@Argument Optional<InvoiceStatus> status,
			@Argument Optional<String> fromDate,
			@Argument Optional<String> toDate) {

		LocalDate from = fromDate.map(LocalDate::parse).orElse(null);
		LocalDate to = toDate.map(LocalDate::parse).orElse(null);

		if (from != null && to != null && from.isAfter(to)) {
			throw new IllegalArgumentException("Tiêu chí không hợp lệ");
		}

		return revenueRepo.findAll().stream()
				.filter(r -> keyword.map(k -> r.getTitle().toLowerCase().contains(k.toLowerCase())).orElse(true))
				.filter(r -> from == null || !r.getStartDate().isBefore(from))
				.filter(r -> to == null || !r.getDueDate().isAfter(to))
				.filter(r -> status.map(s ->
						invoiceRepo.findAllByRevenueId(r.getId()).stream()
								.anyMatch(i -> i.getStatus() == s)
				).orElse(true))
				.collect(Collectors.toList());
	}

	@QueryMapping(name = "getRevenueStatistics")
	public RevenueStats getRevenueStatistics(@Argument String revenueId) {
		Revenue revenue = revenueRepo.findById(revenueId)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy đợt thu phù hợp"));

		List<Invoice> invoices = invoiceRepo.findAllByRevenueId(revenueId);

		int total = invoices.size();
		int paid = (int) invoices.stream().filter(i -> i.getStatus() == InvoiceStatus.PAID).count();
		BigDecimal totalAmount = invoices.stream()
				.filter(i -> i.getStatus() == InvoiceStatus.PAID)
				.map(Invoice::getAmount)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		List<Household> unpaidHouseholds = invoices.stream()
				.filter(i -> i.getStatus() == InvoiceStatus.UNPAID)
				.map(Invoice::getHousehold)
				.distinct()
				.collect(Collectors.toList());

		return RevenueStats.builder()
				.totalHouseholds(total)
				.paidHouseholds(paid)
				.unpaidHouseholds(unpaidHouseholds)
				.totalAmountCollected(totalAmount)
				.build();
	}
}
