package com.example.backend.service.impl;

import com.example.backend.dto.response.HistoryRecordResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.HistoryRecord;
import com.example.backend.repository.HistoryRecordRepository;
import com.example.backend.service.HistoryRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HistoryRecordServiceImpl implements HistoryRecordService {

	private final HistoryRecordRepository historyRecordRepository;

	@Override
	@Transactional
	public void recordAction(String entityType, Integer entityId, String actionType) {
		// Validate parameters
		if (entityType == null || entityType.isBlank()) {
			throw new IllegalArgumentException("Entity type cannot be empty");
		}

		if (entityId == null) {
			throw new IllegalArgumentException("Entity ID cannot be null");
		}

		if (actionType == null || actionType.isBlank()) {
			throw new IllegalArgumentException("Action type cannot be empty");
		}

		// Create and save the history record
		HistoryRecord record = HistoryRecord.builder()
				.entityType(entityType)
				.entityId(entityId)
				.actionType(actionType)
				.timestamp(LocalDateTime.now())
				.build();

		try {
			historyRecordRepository.save(record);
			log.debug("Recorded action: {} on {}:{}", actionType, entityType, entityId);
		} catch (Exception e) {
			log.error("Failed to record history action", e);
			// Don't throw exception to avoid affecting the main operation
		}
	}

	@Override
	public HistoryRecordResponse getHistoryRecordById(Integer id) {
		return historyRecordRepository.findById(id)
				.map(this::mapToHistoryRecordResponse)
				.orElseThrow(() -> new ResourceNotFoundException("History record not found with id: " + id));
	}

	@Override
	public List<HistoryRecordResponse> getHistoryByEntityAndId(String entityType, Integer entityId) {
		return historyRecordRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId).stream()
				.map(this::mapToHistoryRecordResponse)
				.collect(Collectors.toList());
	}

	@Override
	public Page<HistoryRecordResponse> getAllHistoryRecords(Pageable pageable) {
		return historyRecordRepository.findAll(pageable)
				.map(this::mapToHistoryRecordResponse);
	}

	@Override
	public List<HistoryRecordResponse> getHistoryByEntityType(String entityType) {
		return historyRecordRepository.findByEntityTypeOrderByTimestampDesc(entityType).stream()
				.map(this::mapToHistoryRecordResponse)
				.collect(Collectors.toList());
	}

	@Override
	public List<HistoryRecordResponse> getHistoryByActionType(String actionType) {
		return historyRecordRepository.findByActionType(actionType).stream()
				.map(this::mapToHistoryRecordResponse)
				.collect(Collectors.toList());
	}

	private HistoryRecordResponse mapToHistoryRecordResponse(HistoryRecord historyRecord) {
		return HistoryRecordResponse.builder()
				.id(historyRecord.getId())
				.entityType(historyRecord.getEntityType())
				.entityId(historyRecord.getEntityId())
				.actionType(historyRecord.getActionType())
				.timestamp(historyRecord.getTimestamp())
				.build();
	}
}