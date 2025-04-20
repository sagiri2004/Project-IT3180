package com.example.backend.repository;

import com.example.backend.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, String> {
	List<Invoice> findAllByRevenueId(String revenueId);
}
