package com.example.backend.service;

import com.example.backend.dto.request.DonationRequest;
import com.example.backend.dto.response.DonationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DonationService {
	DonationResponse createDonation(DonationRequest request);
	DonationResponse getDonationById(Integer id);
	Page<DonationResponse> getAllDonations(Pageable pageable);
	List<DonationResponse> getDonationsByHousehold(Integer householdId);
	List<DonationResponse> getDonationsByCampaign(Integer campaignId);
	DonationResponse updateDonation(Integer id, DonationRequest request);
	void deleteDonation(Integer id);
}