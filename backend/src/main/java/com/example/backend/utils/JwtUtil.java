package com.example.backend.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

	private final Key secretKey;

	@Value("${jwt.expirationMs}")
	private long expirationMs;

	public JwtUtil(@Value("${jwt.signerKey}") String signerKey) {
		this.secretKey = Keys.hmacShaKeyFor(signerKey.getBytes());
	}

	public String generateToken(String username, Set<String> roles) {
		return Jwts.builder()
				.setSubject(username)
				.claim("roles", roles) // Thêm danh sách roles vào JWT
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expirationMs))
				.signWith(secretKey, SignatureAlgorithm.HS512)
				.compact();
	}

	// 🔹 Lấy username từ JWT
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	public Set<String> extractRoles(String token) {
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token)
				.getBody();

		// Ép kiểu an toàn từ List<Object> sang List<String>
		List<?> rawList = claims.get("roles", List.class);
		Set<String> roles = rawList.stream()
				.filter(obj -> obj instanceof String)
				.map(Object::toString)
				.collect(Collectors.toSet());

		return roles;
	}

	// 🔹 Kiểm tra token có hợp lệ không
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder()
					.setSigningKey(secretKey)
					.build()
					.parseClaimsJws(token);
			return !isTokenExpired(token);
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}

	// 🔹 Kiểm tra token có hết hạn không
	private boolean isTokenExpired(String token) {
		return extractClaim(token, Claims::getExpiration).before(new Date());
	}

	// 🔹 Trích xuất claims từ token
	private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token)
				.getBody();
		return claimsResolver.apply(claims);
	}
}
