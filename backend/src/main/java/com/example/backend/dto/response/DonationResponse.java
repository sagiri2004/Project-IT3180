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
public class DonationResponse {
	Integer id;
	Integer householdId;
	String householdCode;
	String apartmentNumber;
	Integer donationCampaignId;
	String campaignName;
	Double amount;
	LocalDate donationDate;
	String createdBy;
	LocalDateTime createdAt;
}