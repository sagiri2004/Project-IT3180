package com.example.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class HouseholdNotFoundException extends RuntimeException {
	public HouseholdNotFoundException(String message) {
		super(message);
	}
}
