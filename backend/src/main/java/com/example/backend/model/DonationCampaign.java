package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "donation_campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonationCampaign {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;

	@Column(nullable = false)
	String name;

	@Column(nullable = false, length = 1000)
	String description;

	@Column(nullable = false)
	LocalDate startDate;

	LocalDate endDate;

	Double targetAmount;

	@OneToMany(mappedBy = "donationCampaign", cascade = CascadeType.ALL)
	List<Donation> donations;

	String createdBy;

	@CreationTimestamp
	LocalDateTime createdAt;
}