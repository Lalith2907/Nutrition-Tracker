package com.nutrition.tracker.controller;

import com.nutrition.tracker.model.Goal;
import com.nutrition.tracker.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/goal")
@CrossOrigin
public class GoalController {

    @Autowired
    private GoalService goalService;

    @PostMapping("/set")
    public Goal setGoal(@RequestBody Goal goal) {
        return goalService.setGoal(goal);
    }
}
