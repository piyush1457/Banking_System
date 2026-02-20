package com.kodbank.service;

import com.kodbank.dto.LoginRequest;
import com.kodbank.dto.RegisterRequest;
import com.kodbank.entity.KodUser;
import com.kodbank.entity.UserToken;
import com.kodbank.repository.KodUserRepository;
import com.kodbank.repository.UserTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AuthService {

    @Autowired
    private KodUserRepository userRepository;

    @Autowired
    private UserTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // ----------------------------------------------------------------
    // Register — saves new user with BCrypt hashed password
    // ----------------------------------------------------------------
    public void register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username '" + request.getUsername() + "' is already taken.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email '" + request.getEmail() + "' is already registered.");
        }

        KodUser user = new KodUser();
        user.setUid(request.getUid());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hash
        user.setPhone(request.getPhone());
        user.setRole(KodUser.Role.Customer); // always Customer
        user.setBalance(new BigDecimal("100000.00")); // initial balance

        userRepository.save(user);
    }

    // ----------------------------------------------------------------
    // Login — validate credentials, generate JWT, persist token
    // ----------------------------------------------------------------
    public String login(LoginRequest request) {

        // 1. Fetch user
        KodUser user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password."));

        // 2. Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password.");
        }

        // 3. Generate JWT (username = subject, role = claim, HS256)
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());

        // 4. Persist token in UserToken table
        UserToken userToken = new UserToken();
        userToken.setToken(token);
        userToken.setUid(user.getUid());
        userToken.setExpiry(jwtService.getTokenExpiry());
        tokenRepository.save(userToken);

        return token;
    }
}
