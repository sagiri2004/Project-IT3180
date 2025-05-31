package com.example.backend.dto.response;

import com.example.backend.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
	private String id;
	private String username;
	private String email;
	private String name;
	private Set<UserRole> roles;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private LocalDateTime lastLoginAt;
}