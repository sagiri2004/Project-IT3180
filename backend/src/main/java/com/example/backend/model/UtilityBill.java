package com.example.backend.model;

import com.example.backend.model.enums.UtilityType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "utility_bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UtilityBill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "household_id", nullable = false)
    Household household;

    @Column(nullable = false, length = 7)
    String monthYear; // Format: 'YYYY-MM'

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    UtilityType type;

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