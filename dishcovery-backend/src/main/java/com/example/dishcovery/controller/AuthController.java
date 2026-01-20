package com.example.dishcovery.controller;

import com.example.dishcovery.entity.User;
import com.example.dishcovery.repository.UserRepository;
import com.example.dishcovery.dto.AuthDtos.*;
import com.example.dishcovery.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        if (req.getUsername() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(AuthResponse.error("username and password required"));
        }
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Username already taken"));
        }

        User u = new User();
        u.setUsername(req.getUsername());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setAvatarUrl(req.getAvatarUrl()); // optional
        userRepository.save(u);

        String token = jwtService.generateToken(u.getId(), u.getUsername());
        return ResponseEntity.ok(AuthResponse.ok(token, new Profile(u.getId(), u.getUsername(), u.getAvatarUrl())));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        Optional<User> userOpt = userRepository.findByUsername(req.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(AuthResponse.error("Invalid credentials"));
        }
        User u = userOpt.get();
        if (!passwordEncoder.matches(req.getPassword(), u.getPasswordHash())) {
            return ResponseEntity.status(401).body(AuthResponse.error("Invalid credentials"));
        }
        String token = jwtService.generateToken(u.getId(), u.getUsername());
        return ResponseEntity.ok(AuthResponse.ok(token, new Profile(u.getId(), u.getUsername(), u.getAvatarUrl())));
    }

    @GetMapping("/me")
    public ResponseEntity<Profile> me(@RequestHeader("Authorization") String authHeader) {
        String token = jwtService.extractBearer(authHeader);
        JwtService.UserClaims claims = jwtService.parseToken(token);
        User u = userRepository.findById(claims.userId()).orElseThrow();
        return ResponseEntity.ok(new Profile(u.getId(), u.getUsername(), u.getAvatarUrl()));
    }
}
