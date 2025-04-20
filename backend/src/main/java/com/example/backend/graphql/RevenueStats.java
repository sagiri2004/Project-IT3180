package com.example.backend.graphql;

import com.example.backend.model.Household;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class RevenueStats {
	int totalHouseholds;
	int paidHouseholds;
	List<Household> unpaidHouseholds;
	BigDecimal totalAmountCollected;
}