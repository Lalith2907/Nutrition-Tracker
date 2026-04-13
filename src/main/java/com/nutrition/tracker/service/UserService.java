package com.nutrition.tracker.service;

import com.nutrition.tracker.model.Admin;
import com.nutrition.tracker.model.User;
import com.nutrition.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register
    public User register(User user) {
        User existing = userRepository.findByEmail(user.getEmail());
        if (existing != null) {
            throw new RuntimeException("User already exists");
        }
        // Always create a Member, not just a User
        com.nutrition.tracker.model.Member member = new com.nutrition.tracker.model.Member();
        member.setName(user.getName());
        member.setEmail(user.getEmail());
        member.setPassword(user.getPassword());
        member.setAge(user.getAge());
        member.setWeight(user.getWeight());
        member.setHeight(user.getHeight());
        return userRepository.save(member);
    }

    // Login
    public User login(String email, String password) {
        // Hardcoded Admin authentication check in the Backend
        if ("admin".equals(email) && "admin".equals(password)) {
            Admin admin = new Admin();
            admin.setUserId(0); // Dummy ID
            admin.setName("System Admin");
            admin.setEmail("admin");
            admin.setPassword("admin");
            return admin;
        }

        User user = userRepository.findByEmail(email);

        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}