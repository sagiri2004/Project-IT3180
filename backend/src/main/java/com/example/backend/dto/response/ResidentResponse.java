package com.example.backend.dto.response;

import com.example.backend.model.enums.Gender;
import com.example.backend.model.enums.RelationshipType;
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
public class ResidentResponse {
	Integer id;
	Integer householdId;
	String householdCode;
	String fullName;
	LocalDate dateOfBirth;
	Gender gender;
	String idCardNumber;
	RelationshipType relationshipWithOwner;
	Boolean isOwner;
	LocalDateTime createdAt;
}