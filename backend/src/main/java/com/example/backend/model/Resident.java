package com.example.backend.model;

import com.example.backend.model.enums.Gender;
import com.example.backend.model.enums.RelationshipType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "residents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Resident {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;

	@ManyToOne
	@JoinColumn(name = "household_id", nullable = false)
	Household household;

	@Column(nullable = false)
	String fullName;

	@Column(nullable = false)
	LocalDate dateOfBirth;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	Gender gender;

	@Column(nullable = false, unique = true)
	String idCardNumber;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	RelationshipType relationshipWithOwner;

	@Column(nullable = false)
	Boolean isOwner;

	@OneToMany(mappedBy = "resident", cascade = CascadeType.ALL)
	List<PopulationChange> populationChanges;

	String createdBy;

	@CreationTimestamp
	LocalDateTime createdAt;
}