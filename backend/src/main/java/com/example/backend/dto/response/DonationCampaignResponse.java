package com.example.backend.dto.response;

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
public class DonationCampaignResponse {
	Integer id;
	String name;
	String description;
	LocalDate startDate;
	LocalDate endDate;
	Double targetAmount;
	Double totalDonated;
	Double remainingAmount;
	Integer totalDonors;
	Boolean isActive;
	String createdBy;
	LocalDateTime createdAt;
}