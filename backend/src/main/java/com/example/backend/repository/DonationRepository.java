package com.example.backend.repository;

import com.example.backend.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Integer> {
	List<Donation> findByHouseholdId(Integer householdId);
	List<Donation> findByDonationCampaignId(Integer donationCampaignId);

	@Query("SELECT SUM(d.amount) FROM Donation d WHERE d.donationCampaign.id = ?1")
	Double getTotalDonationAmountByCampaignId(Integer campaignId);
}