package com.example.backend.service;

import com.example.backend.dto.request.DonationCampaignRequest;
import com.example.backend.dto.response.DonationCampaignResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DonationCampaignService {
	DonationCampaignResponse createDonationCampaign(DonationCampaignRequest request);
	DonationCampaignResponse getDonationCampaignById(Integer id);
	Page<DonationCampaignResponse> getAllDonationCampaigns(Pageable pageable);
	List<DonationCampaignResponse> getActiveDonationCampaigns();
	DonationCampaignResponse updateDonationCampaign(Integer id, DonationCampaignRequest request);
	void deleteDonationCampaign(Integer id);
}