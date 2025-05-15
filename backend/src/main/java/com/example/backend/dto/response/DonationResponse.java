package com.example.backend.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonFormat;

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
	@JsonFormat(pattern = "yyyy-MM-dd")
	LocalDate donationDate;
	String createdBy;
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	LocalDateTime createdAt;
}