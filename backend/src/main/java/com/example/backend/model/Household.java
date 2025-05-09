
package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "households")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Household {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;

	@Column(nullable = false, unique = true)
	String householdCode;

	@Column(nullable = false)
	String apartmentNumber;

	@Column(nullable = false)
	Double areaM2;

	@Column(nullable = false)
	String address;

	@Column(nullable = false)
	String ownerName;

	@Column(nullable = false)
	String phoneNumber;

	@Column(nullable = false)
	LocalDateTime registrationDate;

	@OneToMany(mappedBy = "household", cascade = CascadeType.ALL)
	List<Resident> residents;

	@OneToMany(mappedBy = "household", cascade = CascadeType.ALL)
	List<PopulationChange> populationChanges;

	String createdBy;

	@CreationTimestamp
	LocalDateTime createdAt;
}