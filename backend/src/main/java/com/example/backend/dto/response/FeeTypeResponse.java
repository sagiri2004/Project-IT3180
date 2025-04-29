package com.example.backend.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeeTypeResponse {
	Integer id;
	String name;
	String description;
	Double pricePerM2;
	Boolean isPerM2;
	Boolean isRequired;
	String createdBy;
	LocalDateTime createdAt;
}