package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "fee_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeeType {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;

	@Column(nullable = false, unique = true)
	String name;

	@Column(nullable = false)
	String description;

	@Column(nullable = false)
	Double pricePerM2;

	@Column(nullable = false)
	Boolean isPerM2;

	@Column(nullable = false)
	Boolean isRequired;

	String createdBy;

	@CreationTimestamp
	LocalDateTime createdAt;
}