package com.kodbank.controller;

import com.kodbank.entity.KodUser;
import com.kodbank.repository.KodUserRepository;
import com.kodbank.service.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private KodUserRepository userRepository;

    // ----------------------------------------------------------------
    // GET /api/user/balance
    // Step 1: Extract JWT from cookie
    // Step 2: Verify & validate JWT
    // Step 3: Extract username from token
    // Step 4: Fetch balance from KodUser using username
    // Step 5: Return balance
    // ----------------------------------------------------------------
    @GetMapping("/balance")
    public ResponseEntity<?> getBalance(HttpServletRequest request) {

        // --- Step 1: Extract JWT cookie ---
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "No authentication cookie found. Please login."));
        }

        Optional<String> tokenOptional = Arrays.stream(cookies)
                .filter(c -> "kodbank_token".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();

        if (tokenOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Token not found. Please login."));
        }

        String token = tokenOptional.get();

        // --- Step 2: Verify & validate JWT ---
        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "error", "message", "Invalid or expired token. Please login again."));
        }

        // --- Step 3: Extract username from token ---
        String username = jwtService.extractUsername(token);

        // --- Step 4: Fetch user by username ---
        KodUser user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "User not found."));
        }

        // --- Step 5: Return balance ---
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "username", user.getUsername(),
                "balance", user.getBalance()));
    }
}
