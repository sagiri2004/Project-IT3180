package com.example.backend.model;

import com.example.backend.model.enums.RevenueType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "revenue")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Revenue {

	@Id
	String id;

	@Column(nullable = false)
	String title;

	@Column
	String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	RevenueType type;

	@Column(nullable = false)
	BigDecimal amount;

	@Column
	String createdBy;

	@CreationTimestamp
	@Column(updatable = false)
	LocalDateTime createdAt;

	@Column(nullable = false)
	LocalDate startDate;

	@Column(nullable = false)
	LocalDate dueDate;
}
