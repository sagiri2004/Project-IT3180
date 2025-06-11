package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_fees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleFee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    Vehicle vehicle;

    @Column(nullable = false, length = 7)
    String monthYear; // Format: 'YYYY-MM'

    @Column(nullable = false)
    Double amount;

    @Column(nullable = false)
    Boolean isPaid;

    LocalDate paidDate;

    String paidBy;

    String collectedBy;

    String createdBy;

    @CreationTimestamp
    LocalDateTime createdAt;
} 