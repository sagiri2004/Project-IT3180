package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "history_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HistoryRecord {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer id;

	@Column(nullable = false)
	String entityType; // "Household", "Resident", "PopulationChange"

	@Column(nullable = false)
	Integer entityId;

	@Column(nullable = false)
	String actionType; // "CREATE", "UPDATE", "DELETE"

	@CreationTimestamp
	LocalDateTime timestamp;
}