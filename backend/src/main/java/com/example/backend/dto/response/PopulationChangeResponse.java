package com.example.backend.dto.response;

import com.example.backend.model.enums.ChangeType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PopulationChangeResponse {
	Integer id;
	Integer residentId;
	String residentName;
	Integer householdId;
	String householdCode;
	ChangeType changeType;
	LocalDate startDate;
	LocalDate endDate;
	String reason;
	String destinationAddress;
	String sourceAddress;
	Boolean isApproved;
	LocalDateTime createdAt;
}