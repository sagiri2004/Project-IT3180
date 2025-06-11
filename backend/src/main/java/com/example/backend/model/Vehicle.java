package com.example.backend.model;

import com.example.backend.model.enums.VehicleType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "household_id", nullable = false)
    Household household;

    @Column(nullable = false, unique = true)
    String licensePlate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    VehicleType type;

    LocalDate registeredDate;

    @Column(nullable = false)
    Boolean isActive;

    String createdBy;

    @CreationTimestamp
    LocalDateTime createdAt;
} 