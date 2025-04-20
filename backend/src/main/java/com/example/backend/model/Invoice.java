package com.example.backend.model;

import com.example.backend.model.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Invoice {

	@Id
	String id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "household_id")
	Household household;

	@ManyToOne(optional = false)
	@JoinColumn(name = "revenue_id")
	Revenue revenue;

	@Column(nullable = false)
	BigDecimal amount;

	LocalDate paymentDate;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	InvoiceStatus status;

	@CreationTimestamp
	LocalDate createdAt;
}
