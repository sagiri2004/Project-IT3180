package com.example.backend.repository;

import com.example.backend.model.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthUserRepository extends JpaRepository<AuthUser, String> {
	Optional<AuthUser> findByUsername(String username);
	Optional<AuthUser> findByEmail(String email);
	boolean existsByUsername(String username);
}