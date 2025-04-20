package com.example.backend.dto.request;

import com.example.backend.model.enums.RevenueType;  // Import enum RevenueType
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RevenueRequest {
	String id;
	String title;
	String description;
	RevenueType type;
	BigDecimal amount;
	String createdBy;
	private LocalDate startDate;
	private LocalDate dueDate;
}
