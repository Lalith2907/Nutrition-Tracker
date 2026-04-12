package com.nutrition.tracker.service;

import com.nutrition.tracker.model.Goal;
import com.nutrition.tracker.model.Member;
import com.nutrition.tracker.model.User;
import com.nutrition.tracker.repository.GoalRepository;
import com.nutrition.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    public Goal setGoal(int userId, Goal goal) {
        Goal savedGoal = goalRepository.save(goal);
        User user = userRepository.findById(userId).orElse(null);
        if (user instanceof Member) {
            Member member = (Member) user;
            member.setGoal(savedGoal);
            userRepository.save(member);
        }
        return savedGoal;
    }
}
