package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Donation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;

	@ManyToOne
	@JoinColumn(name = "household_id", nullable = false)
	Household household;

	@ManyToOne
	@JoinColumn(name = "donation_campaign_id", nullable = false)
	DonationCampaign donationCampaign;

	@Column(nullable = false)
	Double amount;

	LocalDate donationDate;

	String createdBy;

	@CreationTimestamp
	LocalDateTime createdAt;
}