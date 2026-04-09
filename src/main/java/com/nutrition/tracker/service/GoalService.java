package com.nutrition.tracker.service;

import com.nutrition.tracker.model.Goal;
import com.nutrition.tracker.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    public Goal setGoal(Goal goal) {
        return goalRepository.save(goal);
    }
}
