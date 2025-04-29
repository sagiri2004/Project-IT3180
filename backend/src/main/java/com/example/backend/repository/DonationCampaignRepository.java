package com.example.backend.repository;

import com.example.backend.model.DonationCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DonationCampaignRepository extends JpaRepository<DonationCampaign, Integer> {
	List<DonationCampaign> findByStartDateBeforeAndEndDateAfter(LocalDate now, LocalDate now2);

	@Query("SELECT dc FROM DonationCampaign dc WHERE dc.endDate IS NULL OR dc.endDate >= CURRENT_DATE")
	List<DonationCampaign> findActiveCampaigns();
}