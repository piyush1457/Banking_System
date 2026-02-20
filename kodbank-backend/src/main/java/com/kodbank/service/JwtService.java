package com.kodbank.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * JwtService — handles token generation, validation, and parsing.
 *
 * Algorithm : HMAC-SHA256 (HS256)
 * Subject : username
 * Claims : role
 */
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationMs;

    // ----------------------------------------------------------------
    // Key derivation — HMAC-SHA256 from the configured secret string
    // ----------------------------------------------------------------
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // ----------------------------------------------------------------
    // Generate a signed JWT token
    // ----------------------------------------------------------------
    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(username) // username as subject
                .claim("role", role) // role as custom claim
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey()) // HS256 signature
                .compact();
    }

    // ----------------------------------------------------------------
    // Parse and validate — throws JwtException if invalid / expired
    // ----------------------------------------------------------------
    public Claims validateAndExtractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ----------------------------------------------------------------
    // Convenience helpers
    // ----------------------------------------------------------------
    public String extractUsername(String token) {
        return validateAndExtractClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return validateAndExtractClaims(token).get("role", String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            validateAndExtractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /** Returns the expiry timestamp as LocalDateTime (for DB storage). */
    public LocalDateTime getTokenExpiry() {
        return LocalDateTime.now().plusSeconds(expirationMs / 1000);
    }
}
