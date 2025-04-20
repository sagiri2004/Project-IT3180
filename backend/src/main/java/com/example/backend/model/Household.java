package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "households")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Household {
	@Id
	String id;

	@Column(nullable = false)
	String address;

	@Column(nullable = false)
	Double area;

	@Column(nullable = false)
	Integer memberCount;

	String createdBy;

	@CreationTimestamp
	LocalDateTime createdAt;
}
