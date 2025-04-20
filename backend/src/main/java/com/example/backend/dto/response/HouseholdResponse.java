package com.example.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HouseholdResponse {
	String id;
	String address;
	Double area;
	Integer memberCount;
	String createdBy;
	String createdAt;
	String message;
}
