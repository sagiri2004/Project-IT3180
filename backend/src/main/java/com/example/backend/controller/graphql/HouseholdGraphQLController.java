package com.example.backend.controller.graphql;

import com.example.backend.dto.response.HouseholdResponse;
import com.example.backend.service.HouseholdService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class HouseholdGraphQLController {

	private final HouseholdService householdService;

	@QueryMapping
	public List<HouseholdResponse> searchHouseholds(@Argument String keyword) {
		log.info("GraphQL: Searching households with keyword: {}", keyword);
		return householdService.searchHouseholds(keyword);
	}

	@QueryMapping
	public HouseholdResponse getHouseholdById(@Argument Integer id) {
		log.info("GraphQL: Fetching household with id: {}", id);
		return householdService.getHouseholdById(id);
	}

	@QueryMapping
	public HouseholdResponse getHouseholdByCode(@Argument String code) {
		log.info("GraphQL: Fetching household with code: {}", code);
		return householdService.getHouseholdByCode(code);
	}
}