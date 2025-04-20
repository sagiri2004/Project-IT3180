package com.example.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RevenueResponse {
	String id;
	String title;
	String description;
	BigDecimal amount;
	String createdBy;
	String createdAt;
	String message;
}
