package com.nutrition.tracker.controller;

import com.nutrition.tracker.model.User;
import com.nutrition.tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.nutrition.tracker.model.Member;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;

    // Register API
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Member user) {
        try {
            return ResponseEntity.ok((Member) userService.register(user));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("User already exists")) {
                return ResponseEntity.badRequest().body("User already exists");
            }
            return ResponseEntity.badRequest().body("Registration failed");
        }
    }

    // Login API
    @PostMapping("/login")
    public User login(@RequestParam String email,
            @RequestParam String password) {
        return userService.login(email, password);
    }
}