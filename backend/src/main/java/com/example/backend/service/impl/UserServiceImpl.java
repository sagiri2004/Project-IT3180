package com.example.backend.service.impl;

import com.example.backend.dto.request.UserCreateRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.User;
import com.example.backend.model.enums.UserRole;
import com.example.backend.repository.AuthUserRepository;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final AuthUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::mapToUserResponse);
    }

    @Override
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUserRoles(String username, Set<UserRole> roles) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        user.setRoles(roles);
        return mapToUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUser(String username, UserUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        
        return mapToUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        userRepository.delete(user);
    }

    @Override
    public List<UserResponse> searchUsers(String keyword) {
        return userRepository.findByUsernameContainingOrNameContainingOrEmailContaining(
                keyword, keyword, keyword)
                .stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse createUser(UserCreateRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .name(request.getName())
                .roles(request.getRoles() != null ? request.getRoles() : Set.of(UserRole.USER))
                .build();

        // Save user
        User savedUser = userRepository.save(user);

        // Convert to response
        return UserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .roles(savedUser.getRoles())
                .createdAt(savedUser.getCreatedAt())
                .updatedAt(savedUser.getUpdatedAt())
                .lastLoginAt(savedUser.getLastLoginAt())
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRoles(user.getRoles());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        response.setLastLoginAt(user.getLastLoginAt());
        return response;
    }
} 