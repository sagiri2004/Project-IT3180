package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HouseholdRequest {
	String householdCode;

	@NotBlank(message = "Apartment number cannot be empty")
	String apartmentNumber;

	@NotNull(message = "Area cannot be null")
	@Positive(message = "Area must be positive")
	Double areaM2;

	@NotBlank(message = "Address cannot be empty")
	String address;

	@NotBlank(message = "Owner name cannot be empty")
	String ownerName;

	@NotBlank(message = "Phone number cannot be empty")
	String phoneNumber;
}