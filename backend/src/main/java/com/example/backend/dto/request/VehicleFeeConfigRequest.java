package com.example.backend.dto.request;

import com.example.backend.model.enums.TicketType;
import com.example.backend.model.enums.VehicleType;
import lombok.Data;

@Data
public class VehicleFeeConfigRequest {
    private VehicleType vehicleType;
    private TicketType ticketType;
    private Double price;
} 