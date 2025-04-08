package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "auth_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthUser {
	@Id
	String id;

	@Column(nullable = false, unique = true)
	String username;

	@Column(nullable = false)
	String password;

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
	@Column(name = "role")
	Set<String> roles;

	@CreationTimestamp
	@Column(updatable = false)
	LocalDateTime createdAt;

	@UpdateTimestamp
	LocalDateTime updatedAt;

	LocalDateTime lastLoginAt;
}
