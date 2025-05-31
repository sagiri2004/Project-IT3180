package com.example.backend.service;

import com.example.backend.dto.response.HistoryRecordResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface HistoryRecordService {
	/**
	 * Records an action performed on an entity in the system
	 *
	 * @param entityType The type of entity (Household, Resident, PopulationChange, etc.)
	 * @param entityId The ID of the entity
	 * @param actionType The type of action (CREATE, UPDATE, DELETE)
	 */
	void recordAction(String entityType, Integer entityId, String actionType);

	/**
	 * Gets a history record by its ID
	 *
	 * @param id The ID of the history record
	 * @return The history record response
	 */
	HistoryRecordResponse getHistoryRecordById(Integer id);

	/**
	 * Gets all history records for a specific entity
	 *
	 * @param entityType The type of entity
	 * @param entityId The ID of the entity
	 * @return List of history record responses
	 */
	List<HistoryRecordResponse> getHistoryByEntityAndId(String entityType, Integer entityId);

	/**
	 * Gets all history records with pagination
	 *
	 * @param pageable Pagination information
	 * @return Page of history record responses
	 */
	Page<HistoryRecordResponse> getAllHistoryRecords(Pageable pageable);

	/**
	 * Gets all history records for a specific entity type
	 *
	 * @param entityType The type of entity
	 * @return List of history record responses
	 */
	List<HistoryRecordResponse> getHistoryByEntityType(String entityType);

	/**
	 * Gets all history records for a specific action type
	 *
	 * @param actionType The type of action
	 * @return List of history record responses
	 */
	List<HistoryRecordResponse> getHistoryByActionType(String actionType);
}