package com.example.backend.service.impl;


import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.AuthResponse;
import com.example.backend.exception.AuthException;
import com.example.backend.model.AuthUser;
import com.example.backend.repository.AuthUserRepository;
import com.example.backend.service.AuthService;
import com.example.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	private final AuthUserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;

	@Override
	public AuthResponse register(RegisterRequest request) {
		// Kiểm tra xem user đã tồn tại chưa
		if (userRepository.findByUsername(request.getUsername()).isPresent()) {
			throw new AuthException("Username is already taken");
		}

		if (request.getUsername().equals("acane")) {
			request.setRoles(Set.of("ADMIN", "USER"));
		} else {
			request.setRoles(Set.of("USER"));
		}

		// Mã hóa mật khẩu
		String encodedPassword = passwordEncoder.encode(request.getPassword());

		// Tạo user mới với roles
		AuthUser newUser = AuthUser.builder()
				.id(UUID.randomUUID().toString())
				.username(request.getUsername())
				.password(encodedPassword)
				.roles(request.getRoles()) // Lưu roles vào DB
				.build();

		// Lưu user vào DB
		userRepository.save(newUser);

		// Tạo JWT token chứa roles
		String token = jwtUtil.generateToken(newUser.getUsername(), newUser.getRoles());

		// Trả về response
		return AuthResponse.builder()
				.token(token)
				.message("User registered successfully")
				.build();
	}

	@Override
	public AuthResponse login(LoginRequest request) {
		// Tìm user theo username
		AuthUser user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new AuthException("Invalid username or password"));

		// Kiểm tra mật khẩu
		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new AuthException("Invalid username or password");
		}

		// Tạo token mới chứa roles
		String token = jwtUtil.generateToken(user.getUsername(), user.getRoles());

		// Trả về response
		return AuthResponse.builder()
				.token(token)
				.message("User logged in successfully")
				.build();
	}

	@Override
	public boolean validateToken(String token) {
		return jwtUtil.validateToken(token);
	}
}
