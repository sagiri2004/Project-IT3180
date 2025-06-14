package com.example.backend.controller;

import com.example.backend.model.VehicleFeeConfig;
import com.example.backend.repository.VehicleFeeConfigRepository;
import com.example.backend.dto.request.VehicleFeeConfigRequest;
import com.example.backend.dto.response.VehicleFeeConfigResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicle-fee-configs")
@RequiredArgsConstructor
public class VehicleFeeConfigController {
    private final VehicleFeeConfigRepository configRepo;

    @GetMapping
    public List<VehicleFeeConfigResponse> getAll() {
        return configRepo.findAll().stream().map(this::toResponse).toList();
    }

    @PostMapping
    public ResponseEntity<VehicleFeeConfigResponse> create(@Validated @RequestBody VehicleFeeConfigRequest req) {
        VehicleFeeConfig config = VehicleFeeConfig.builder()
                .vehicleType(req.getVehicleType())
                .ticketType(req.getTicketType())
                .price(req.getPrice())
                .build();
        VehicleFeeConfig saved = configRepo.save(config);
        return ResponseEntity.ok(toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleFeeConfigResponse> update(@PathVariable Integer id, @Validated @RequestBody VehicleFeeConfigRequest req) {
        VehicleFeeConfig config = configRepo.findById(id).orElseThrow();
        config.setVehicleType(req.getVehicleType());
        config.setTicketType(req.getTicketType());
        config.setPrice(req.getPrice());
        VehicleFeeConfig saved = configRepo.save(config);
        return ResponseEntity.ok(toResponse(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        configRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private VehicleFeeConfigResponse toResponse(VehicleFeeConfig config) {
        VehicleFeeConfigResponse res = new VehicleFeeConfigResponse();
        res.setId(config.getId());
        res.setVehicleType(config.getVehicleType());
        res.setTicketType(config.getTicketType());
        res.setPrice(config.getPrice());
        return res;
    }
} 