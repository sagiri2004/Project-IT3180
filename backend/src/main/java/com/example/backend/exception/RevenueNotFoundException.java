package com.example.backend.exception;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Revenue item not found")
public class RevenueNotFoundException extends RuntimeException {
	public RevenueNotFoundException(String message) {
		super(message);
	}
}
