package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthUserRepository extends JpaRepository<User, String> {
	Optional<User> findByUsername(String username);
	Optional<User> findByEmail(String email);
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
	Optional<User> findByResetCode(String resetCode);

	List<User> findByUsernameContainingOrNameContainingOrEmailContaining(
			String username, String name, String email);
}