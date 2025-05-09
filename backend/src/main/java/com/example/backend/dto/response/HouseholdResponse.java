package com.example.backend.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HouseholdResponse {
	Integer id;
	String householdCode;
	String apartmentNumber;
	Double areaM2;
	String address;
	String ownerName;
	String phoneNumber;
	LocalDateTime registrationDate;
	Integer residentCount;
	LocalDateTime createdAt;
	
	// Additional fields for detailed information
	List<ResidentResponse> members;
	List<DonationResponse> donations;
	List<FeeCollectionResponse> feeCollections;
	List<PopulationChangeResponse> populationChanges;
}