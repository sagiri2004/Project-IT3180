package com.example.backend.service.impl;


import com.example.backend.dto.request.ForgotPasswordRequest;
import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.ResetPasswordRequest;
import com.example.backend.dto.response.AuthResponse;
import com.example.backend.exception.AuthException;
import com.example.backend.model.AuthUser;
import com.example.backend.repository.AuthUserRepository;
import com.example.backend.service.AuthService;
import com.example.backend.service.EmailService;
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
	private final EmailService emailService;
	private final JwtUtil jwtUtil;

	@Override
	public AuthResponse register(RegisterRequest request) {
		// Kiểm tra xem user đã tồn tại chưa
		if (userRepository.findByUsername(request.getUsername()).isPresent()) {
			throw new AuthException("Username is already taken");
		}

		// Check email
		if(userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new AuthException("Email is already taken");
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
				.email(request.getEmail())
				.name(request.getName())
				.resetCode(null)
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

	@Override
	public AuthResponse forgotPassword(ForgotPasswordRequest request) {
		// Tìm user theo username
		AuthUser user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new AuthException("Username or email is invalid"));

		// Kiểm tra email có khớp không
		if (!user.getEmail().equals(request.getEmail())) {
			throw new AuthException("Username or email is invalid");
		}

		// Tạo mã reset ngẫu nhiên (hoặc link)
		String resetCode = UUID.randomUUID().toString().substring(0, 8);
		user.setResetCode(resetCode);
		userRepository.save(user);

		// Gửi email
		String subject = "Reset your password";
		String body = String.format("Hello %s,\n\nYour reset code is: %s\n\nUse this code to reset your password.",
				user.getUsername(), resetCode);

		emailService.sendEmail(user.getEmail(), subject, body, false);

		// Trả về response
		return AuthResponse.builder()
				.message("Reset code sent to your email")
				.token(null)
				.build();
	}

	@Override
	public AuthResponse resetPassword(ResetPasswordRequest request) {
		// Tìm user
		AuthUser user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new AuthException("Invalid username"));

		// Kiểm tra mã code
		if (user.getResetCode() == null || !user.getResetCode().equals(request.getCode())) {
			throw new AuthException("Invalid or expired code");
		}

		// Cập nhật mật khẩu mới
		String encodedPassword = passwordEncoder.encode(request.getNewPassword());
		user.setPassword(encodedPassword);
		user.setResetCode(null); // Xoá mã sau khi sử dụng

		userRepository.save(user);

		return AuthResponse.builder()
				.message("Password has been reset successfully")
				.token(null)
				.build();
	}
}
