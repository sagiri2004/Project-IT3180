package com.example.backend.model.enums;

public enum Gender {
	MALE("Nam"),
	FEMALE("Nữ"),
	OTHER("Khác");

	private final String description;

	Gender(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}
}