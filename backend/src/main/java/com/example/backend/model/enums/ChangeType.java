package com.example.backend.model.enums;

public enum ChangeType {
	MOVE_IN("Chuyển đến"),
	MOVE_OUT("Chuyển đi"),
	TEMPORARY_RESIDENCE("Tạm trú"),
	TEMPORARY_ABSENCE("Tạm vắng"),
	BIRTH("Sinh"),
	DEATH("Mất"),
	CHANGE_INFO("Thay đổi thông tin");

	private final String description;

	ChangeType(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}
}