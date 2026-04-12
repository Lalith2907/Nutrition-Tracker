package com.nutrition.tracker.service;

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
        User user = userRepository.findByEmail(email);

        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}