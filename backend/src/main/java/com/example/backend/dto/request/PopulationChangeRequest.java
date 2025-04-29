package com.example.backend.dto.request;

import com.example.backend.model.enums.ChangeType;
import jakarta.validation.constraints.NotNull;
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
public class PopulationChangeRequest {
	@NotNull(message = "Resident ID cannot be null")
	Integer residentId;

	Integer householdId;

	@NotNull(message = "Change type cannot be null")
	ChangeType changeType;

	@NotNull(message = "Start date cannot be null")
	LocalDate startDate;

	LocalDate endDate;

	String reason;

	String destinationAddress;

	String sourceAddress;
}