package com.example.backend.dto.response;

import com.example.backend.model.enums.InvoiceStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class InvoiceResponse {
	private String id;
	private String householdId;
	private String revenueId;
	private BigDecimal amount;
	private LocalDate paymentDate;
	private InvoiceStatus status;
	private String message;
}
