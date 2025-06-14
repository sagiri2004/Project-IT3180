package com.example.backend.service.impl;

import com.example.backend.dto.request.ForgotPasswordRequest;
import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.ResetPasswordRequest;
import com.example.backend.dto.response.AuthResponse;
import com.example.backend.exception.AuthException;
import com.example.backend.model.User;
import com.example.backend.model.enums.UserRole;
import com.example.backend.repository.AuthUserRepository;
import com.example.backend.service.AuthService;
import com.example.backend.service.EmailService;
import com.example.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	private final AuthUserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final EmailService emailService;
	private final JwtUtil jwtUtil;

	@Override
	public AuthResponse register(RegisterRequest request) {
		// Kiểm tra xem user đã tồn tại chưa
		if (userRepository.findByUsername(request.getUsername()).isPresent()) {
			throw new AuthException("Username is already taken");
		}

		// Kiểm tra email
		if (userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new AuthException("Email is already taken");
		}

		// Kiểm tra nếu là user đặc biệt
		if (request.getUsername().equals("acane")) {
			request.setRoles(Set.of(UserRole.LEADER));
		}

		// Mã hóa mật khẩu
		String encodedPassword = passwordEncoder.encode(request.getPassword());

		// Tạo user mới với roles (dùng enum trực tiếp)
		User newUser = User.builder()
				.id(UUID.randomUUID().toString())
				.username(request.getUsername())
				.password(encodedPassword)
				.email(request.getEmail())
				.name(request.getName())
				.resetCode(null)
				.roles(request.getRoles())
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
		User user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new AuthException("Invalid username or password"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new AuthException("Invalid username or password");
		}

		// Update last login time
		user.setLastLoginAt(LocalDateTime.now());
		userRepository.save(user);

		String token = jwtUtil.generateToken(user.getUsername(), user.getRoles());

		return AuthResponse.builder()
				.token(token)
				.message("User logged in successfully")
				.build();
	}

	@Override
	public boolean validateToken(String token) {
		return jwtUtil.validateToken(token);
	}

	@Override
	public AuthResponse forgotPassword(ForgotPasswordRequest request) {
		User user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new AuthException("Username or email is invalid"));

		if (!user.getEmail().equals(request.getEmail())) {
			throw new AuthException("Username or email is invalid");
		}

		String resetCode = UUID.randomUUID().toString().substring(0, 8);
		user.setResetCode(resetCode);
		userRepository.save(user);

		String subject = "Reset your password";
		String body = String.format("Hello %s,\n\nYour reset code is: %s\n\nUse this code to reset your password.",
				user.getUsername(), resetCode);

		emailService.sendEmail(user.getEmail(), subject, body, false);

		return AuthResponse.builder()
				.message("Reset code sent to your email")
				.token(null)
				.build();
	}

	@Override
	public AuthResponse resetPassword(ResetPasswordRequest request) {
		User user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new AuthException("Invalid username"));

		if (user.getResetCode() == null || !user.getResetCode().equals(request.getCode())) {
			throw new AuthException("Invalid or expired code");
		}

		String encodedPassword = passwordEncoder.encode(request.getNewPassword());
		user.setPassword(encodedPassword);
		user.setResetCode(null);

		userRepository.save(user);

		return AuthResponse.builder()
				.message("Password has been reset successfully")
				.token(null)
				.build();
	}
}
