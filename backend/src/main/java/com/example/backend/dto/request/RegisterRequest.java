package com.example.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;
import java.util.HashSet;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {
	String username;
	String password;

	@Builder.Default
	Set<String> roles = new HashSet<>(Set.of("USER"));
}
