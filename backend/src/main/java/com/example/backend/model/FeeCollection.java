package com.example.backend.model;

import com.example.backend.config.YearMonthConverter;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Entity
@Table(name = "fee_collections", uniqueConstraints = {
		@UniqueConstraint(columnNames = {"household_id", "fee_type_id", "month_year"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeeCollection {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;

	@ManyToOne
	@JoinColumn(name = "household_id", nullable = false)
	Household household;

	@ManyToOne
	@JoinColumn(name = "fee_type_id", nullable = false)
	FeeType feeType;

	@Column(name = "month_year", nullable = false, length = 7)
	@Convert(converter = YearMonthConverter.class)
	YearMonth yearMonth;

	@Column(nullable = false)
	Double amount;

	@Column(nullable = false)
	Boolean isPaid;

	LocalDate paidDate;

	String paidBy;

	String collectedBy;

	@Column(nullable = false)
	String createdBy;

	@CreationTimestamp
	LocalDateTime createdAt;
}