package com.example.backend.dto.request;

import com.example.backend.model.enums.Gender;
import com.example.backend.model.enums.RelationshipType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResidentRequest {
	@NotNull(message = "Household ID cannot be null")
	Integer householdId;

	@NotBlank(message = "Full name cannot be empty")
	String fullName;

	@NotNull(message = "Date of birth cannot be null")
	@Past(message = "Date of birth must be in the past")
	LocalDate dateOfBirth;

	@NotNull(message = "Gender cannot be null")
	Gender gender;

	String idCardNumber;

	@NotNull(message = "Relationship type cannot be null")
	RelationshipType relationshipWithOwner;

	@NotNull(message = "Owner status cannot be null")
	Boolean isOwner;
}