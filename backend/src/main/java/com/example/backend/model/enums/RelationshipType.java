package com.example.backend.model.enums;

public enum RelationshipType {
	OWNER("Chủ hộ"),
	SPOUSE("Vợ/Chồng"),
	CHILD("Con"),
	PARENT("Cha/Mẹ"),
	SIBLING("Anh/Chị/Em"),
	GRANDPARENT("Ông/Bà"),
	GRANDCHILD("Cháu"),
	RELATIVE("Họ hàng"),
	OTHER("Khác");

	private final String description;

	RelationshipType(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}
}
