package com.example.backend.service;

import com.example.backend.dto.request.UserCreateRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface UserService {
    Page<UserResponse> getAllUsers(Pageable pageable);
    UserResponse getUserByUsername(String username);
    UserResponse updateUserRoles(String username, Set<UserRole> roles);
    UserResponse updateUser(String username, UserUpdateRequest request);
    void deleteUser(String username);
    List<UserResponse> searchUsers(String keyword);
    UserResponse createUser(UserCreateRequest request);
} 