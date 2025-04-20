package com.example.backend.service.impl;

import com.example.backend.dto.request.RevenueRequest;
import com.example.backend.dto.response.RevenueResponse;
import com.example.backend.exception.RevenueNotFoundException;
import com.example.backend.model.Revenue;
import com.example.backend.repository.RevenueRepository;
import com.example.backend.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RevenueServiceImpl implements RevenueService {

	private final RevenueRepository repository;

	@Override
	public RevenueResponse create(RevenueRequest request) {
		String revenueId = UUID.randomUUID().toString();

		// Chuyển request thành đối tượng Revenue
		Revenue item = Revenue.builder()
				.id(revenueId)
				.title(request.getTitle())
				.description(request.getDescription())
				.type(request.getType())  // Sử dụng enum trực tiếp
				.amount(request.getAmount())
				.createdBy(request.getCreatedBy())
				.dueDate(request.getDueDate())
				.startDate(request.getStartDate())
				.build();

		// Lưu đối tượng Revenue vào DB
		Revenue savedItem = repository.save(item);

		// Tạo và trả về response
		return RevenueResponse.builder()
				.id(savedItem.getId())
				.title(savedItem.getTitle())
				.description(savedItem.getDescription())
				.amount(savedItem.getAmount())
				.createdBy(savedItem.getCreatedBy())
				.createdAt(savedItem.getCreatedAt().toString())
				.dueDate(request.getDueDate())
				.startDate(request.getStartDate())
				.message("Revenue item created successfully")
				.build();
	}

	@Override
	public RevenueResponse update(String id, RevenueRequest request) {
		// Tìm đối tượng Revenue theo ID
		Revenue item = repository.findById(id)
				.orElseThrow(() -> new RevenueNotFoundException("Revenue item with id " + id + " not found"));

		// Cập nhật thông tin
		item.setTitle(request.getTitle());
		item.setDescription(request.getDescription());
		item.setType(request.getType());  // Sử dụng enum trực tiếp
		item.setAmount(request.getAmount());
		item.setDueDate(request.getDueDate());
		item.setStartDate(request.getStartDate());

		// Lưu cập nhật vào DB
		Revenue updatedItem = repository.save(item);

		// Tạo và trả về response
		return RevenueResponse.builder()
				.id(updatedItem.getId())
				.title(updatedItem.getTitle())
				.description(updatedItem.getDescription())
				.amount(updatedItem.getAmount())
				.createdBy(updatedItem.getCreatedBy())
				.createdAt(updatedItem.getCreatedAt().toString())
				.dueDate(updatedItem.getDueDate())
				.startDate(updatedItem.getStartDate())
				.message("Revenue item updated successfully")
				.build();
	}

	@Override
	public RevenueResponse delete(String id) {
		// Kiểm tra sự tồn tại của Revenue item
		Revenue item = repository.findById(id)
				.orElseThrow(() -> new RevenueNotFoundException("Revenue item with id " + id + " not found"));

		// Xoá item khỏi DB
		repository.deleteById(id);

		// Tạo và trả về response
		return RevenueResponse.builder()
				.message("Revenue item deleted successfully")
				.build();
	}

	@Override
	public List<RevenueResponse> getAll() {
		// Lấy tất cả các revenue item từ DB
		List<Revenue> revenues = repository.findAll();

		return revenues.stream()
				.map(revenue -> RevenueResponse.builder()
						.id(revenue.getId())
						.title(revenue.getTitle())
						.description(revenue.getDescription())
						.amount(revenue.getAmount())
						.createdBy(revenue.getCreatedBy())
						.createdAt(revenue.getCreatedAt().toString())
						.dueDate(revenue.getDueDate())
						.startDate(revenue.getStartDate())
						.message("Revenue item retrieved successfully")
						.build())
				.collect(Collectors.toList());
	}

	@Override
	public RevenueResponse getById(String id) {
		Revenue item = repository.findById(id)
				.orElseThrow(() -> new RevenueNotFoundException("Revenue item with id " + id + " not found"));

		return RevenueResponse.builder()
				.id(item.getId())
				.title(item.getTitle())
				.description(item.getDescription())
				.amount(item.getAmount())
				.createdBy(item.getCreatedBy())
				.createdAt(item.getCreatedAt().toString())
				.dueDate(item.getDueDate())
				.startDate(item.getStartDate())
				.message("Revenue item retrieved successfully")
				.build();
	}
}
