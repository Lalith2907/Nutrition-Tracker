package com.nutrition.tracker.repository;

import com.nutrition.tracker.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalRepository extends JpaRepository<Goal, Integer> {}
