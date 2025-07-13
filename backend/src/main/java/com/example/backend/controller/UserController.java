package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id).orElseThrow();
        user.setName(userDetails.getName());
        user.setRole(userDetails.getRole());
        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    // Get current user's profile
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        // TODO: Replace with real user lookup
        Map<String, Object> user = new HashMap<>();
        user.put("name", userDetails.getUsername());
        user.put("role", "USER");
        return ResponseEntity.ok(user);
    }

    // Update current user's profile
    @PutMapping("/me")
    public ResponseEntity<Map<String, Object>> updateCurrentUser(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String, Object> updates) {
        // TODO: Update user in DB
        Map<String, Object> user = new HashMap<>();
        user.put("name", updates.getOrDefault("name", userDetails.getUsername()));
        user.put("role", "USER");
        return ResponseEntity.ok(user);
    }

    // Change password
    @PostMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String, String> body) {
        // TODO: Implement real password change logic
        String newPassword = body.get("password");
        // ...
        return ResponseEntity.ok(Map.of("status", "Password changed (dummy response)"));
    }
}