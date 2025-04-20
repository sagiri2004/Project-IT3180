package com.example.backend.dto.request;

import com.example.backend.model.enums.InvoiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InvoiceRequest {
	private String householdId;
	private String revenueId;
	private BigDecimal amount;
	private LocalDate paymentDate;
	private InvoiceStatus status;
}
