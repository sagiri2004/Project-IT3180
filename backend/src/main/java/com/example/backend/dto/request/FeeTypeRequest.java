package com.example.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeTypeRequest {
	@NotBlank(message = "Fee type name is required")
	private String name;

	@NotBlank(message = "Description is required")
	private String description;

	@NotNull(message = "Price per m2 is required")
	@Min(value = 0, message = "Price per m2 must be positive")
	private Double pricePerM2;

	@NotNull(message = "You must specify if this fee is calculated per m2")
	private Boolean isPerM2;

	@NotNull(message = "You must specify if this fee is required")
	private Boolean isRequired;
}