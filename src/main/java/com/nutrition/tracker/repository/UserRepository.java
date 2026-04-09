package com.nutrition.tracker.repository;

import com.nutrition.tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);

    User findByNameIgnoreCase(String name);
}