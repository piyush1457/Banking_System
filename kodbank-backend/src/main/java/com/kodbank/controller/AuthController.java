package com.kodbank.controller;

import com.kodbank.dto.LoginRequest;
import com.kodbank.dto.RegisterRequest;
import com.kodbank.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ----------------------------------------------------------------
    // POST /api/auth/register
    // ----------------------------------------------------------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Registration successful! Please login."));
        } catch (Exception e) {
            // Surface the real root cause message
            String msg = e.getMessage();
            Throwable cause = e.getCause();
            while (cause != null) {
                msg = cause.getMessage();
                cause = cause.getCause();
            }
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", msg != null ? msg : "Registration failed. Please check your input."));
        }
    }

    // ----------------------------------------------------------------
    // POST /api/auth/login
    // ----------------------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        try {
            String token = authService.login(request);

            Cookie cookie = new Cookie("kodbank_token", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(86400);
            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Login successful!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()));
        }
    }
}
