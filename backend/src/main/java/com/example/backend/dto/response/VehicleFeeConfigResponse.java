package com.example.backend.dto.response;

import com.example.backend.model.enums.TicketType;
import com.example.backend.model.enums.VehicleType;
import lombok.Data;

@Data
public class VehicleFeeConfigResponse {
    private Integer id;
    private VehicleType vehicleType;
    private TicketType ticketType;
    private Double price;
} 