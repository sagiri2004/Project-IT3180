package com.example.backend.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeeCollectionResponse {
	Integer id;
	Integer householdId;
	String householdCode;
	String apartmentNumber;
	Integer feeTypeId;
	String feeTypeName;
	YearMonth yearMonth;
	Double amount;
	Boolean isPaid;
	LocalDate paidDate;
	String paidBy;
	String collectedBy;
	String createdBy;
	LocalDateTime createdAt;
}