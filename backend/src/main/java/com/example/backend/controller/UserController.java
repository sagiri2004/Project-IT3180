package com.example.backend.controller;

import com.example.backend.dto.request.EmailRequest;
import com.example.backend.dto.request.UserCreateRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.enums.UserRole;
import com.example.backend.service.EmailService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
	private final EmailService emailService;
	private final UserService userService;

	@GetMapping
	@PreAuthorize("hasAnyRole('LEADER', 'SUB_LEADER')")
	public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(Pageable pageable) {
		log.info("Fetching all users with pagination: {}", pageable);
		Page<UserResponse> response = userService.getAllUsers(pageable);
		return ResponseEntity.ok(new ApiResponse<>(true, "Users retrieved successfully", response));
	}

	@GetMapping("/{username}")
	@PreAuthorize("hasAnyRole('LEADER', 'SUB_LEADER')")
	public ResponseEntity<ApiResponse<UserResponse>> getUserByUsername(@PathVariable String username) {
		log.info("Fetching user with username: {}", username);
		UserResponse response = userService.getUserByUsername(username);
		return ResponseEntity.ok(new ApiResponse<>(true, "User retrieved successfully", response));
	}

	@PutMapping("/{username}/roles")
	@PreAuthorize("hasAnyRole('LEADER', 'SUB_LEADER')")
	public ResponseEntity<ApiResponse<UserResponse>> updateUserRoles(
			@PathVariable String username,
			@RequestBody Set<UserRole> roles) {
		log.info("Updating roles for user: {} with roles: {}", username, roles);
		UserResponse response = userService.updateUserRoles(username, roles);
		return ResponseEntity.ok(new ApiResponse<>(true, "User roles updated successfully", response));
	}

	@PutMapping("/{username}")
	@PreAuthorize("hasAnyRole('LEADER', 'SUB_LEADER')")
	public ResponseEntity<ApiResponse<UserResponse>> updateUser(
			@PathVariable String username,
			@RequestBody UserUpdateRequest request) {
		log.info("Updating user: {}", username);
		UserResponse response = userService.updateUser(username, request);
		return ResponseEntity.ok(new ApiResponse<>(true, "User updated successfully", response));
	}

	@DeleteMapping("/{username}")
	@PreAuthorize("hasAnyRole('LEADER', 'SUB_LEADER')")
	public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String username) {
		log.info("Deleting user: {}", username);
		userService.deleteUser(username);
		return ResponseEntity.ok(new ApiResponse<>(true, "User deleted successfully", null));
	}

	@GetMapping("/search")
	@PreAuthorize("hasAnyRole('LEADER', 'SUB_LEADER')")
	public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(@RequestParam String keyword) {
		log.info("Searching users with keyword: {}", keyword);
		List<UserResponse> response = userService.searchUsers(keyword);
		return ResponseEntity.ok(new ApiResponse<>(true, "Search results", response));
	}

	@PostMapping("/send-email")
	@PreAuthorize("hasAnyRole('LEADER', 'SUB_LEADER')")
	public ResponseEntity<ApiResponse<Void>> sendEmail(@RequestBody EmailRequest request) {
		log.info("Sending email to: {}", request.getTo());
		emailService.sendEmail(
				request.getTo(),
				request.getSubject(),
				request.getText(),
				request.isHtml()
		);
		return ResponseEntity.ok(new ApiResponse<>(true, "Email sent successfully", null));
	}

	@PostMapping
	@PreAuthorize("hasAnyRole('LEADER', 'SUB_LEADER')")
	public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody UserCreateRequest request) {
		log.info("Creating new user with username: {}", request.getUsername());
		UserResponse response = userService.createUser(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse<>(true, "User created successfully", response));
	}
}
