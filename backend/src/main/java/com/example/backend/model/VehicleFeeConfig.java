package com.example.backend.model;

import com.example.backend.model.enums.TicketType;
import com.example.backend.model.enums.VehicleType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "vehicle_fee_configs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"vehicleType", "ticketType"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VehicleFeeConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    VehicleType vehicleType; // CAR, MOTORBIKE

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    TicketType ticketType; // MONTHLY, DAILY

    @Column(nullable = false)
    Double price;
} 