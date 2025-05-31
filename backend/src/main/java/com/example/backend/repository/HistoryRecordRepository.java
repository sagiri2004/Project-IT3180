package com.example.backend.repository;

import com.example.backend.model.HistoryRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRecordRepository extends JpaRepository<HistoryRecord, Integer> {
	List<HistoryRecord> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, Integer entityId);
	List<HistoryRecord> findByEntityTypeOrderByTimestampDesc(String entityType);
	List<HistoryRecord> findByActionType(String actionType);
}