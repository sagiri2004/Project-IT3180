package com.example.backend.model;

import com.example.backend.model.enums.ChangeType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "population_changes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PopulationChange {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;

	@ManyToOne
	@JoinColumn(name = "resident_id", nullable = false)
	Resident resident;

	@ManyToOne
	@JoinColumn(name = "household_id", nullable = false)
	Household household;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	ChangeType changeType;

	@Column(nullable = false)
	LocalDate startDate;

	LocalDate endDate;

	String reason;

	String destinationAddress;

	String sourceAddress;

	@Column(nullable = false)
	Boolean isApproved;

	String createdBy;

	@CreationTimestamp
	LocalDateTime createdAt;
}