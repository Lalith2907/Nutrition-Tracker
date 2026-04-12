package com.nutrition.tracker.service;

import com.nutrition.tracker.model.Meal;
import com.nutrition.tracker.model.MealEntry;
import com.nutrition.tracker.model.Member;
import com.nutrition.tracker.repository.MealRepository;
import com.nutrition.tracker.repository.MealEntryRepository;
import com.nutrition.tracker.repository.UserRepository;
import com.nutrition.tracker.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private MealEntryRepository mealEntryRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> generateReport(LocalDate start, LocalDate end, String userName) {
        User user = userRepository.findByNameIgnoreCase(userName);
        double totalCalories = 0;
        double targetCalories = 0;
        String status = "No goal set";

        if (user != null) {
            if (user instanceof Member) {
                Member member = (Member) user;
                if (member.getGoal() != null) {
                    targetCalories = member.getGoal().getCalorieTarget();
                }
            }

            List<Meal> meals = mealRepository.getMealsBetweenDates(start, end, user.getUserId());
            if (!meals.isEmpty()) {
                List<Integer> mealIds = meals.stream().map(Meal::getMealId).toList();
                List<MealEntry> entries = mealEntryRepository.findAllByMealIds(mealIds);
                for (MealEntry entry : entries) {
                    totalCalories += entry.getSubtotalCalories();
                }
            }
        }
        
        Map<String, Object> report = new HashMap<>();
        report.put("totalCalories", totalCalories);
        
        if (targetCalories > 0) {
            report.put("targetCalories", targetCalories);
            if (totalCalories >= targetCalories) {
                report.put("status", "Goal Met!");
                report.put("caloriesLeft", 0.0);
            } else {
                report.put("status", "Goal Not Met");
                report.put("caloriesLeft", targetCalories - totalCalories);
            }
        } else {
            report.put("status", "No goal set");
        }
        
        return report;
    }
}
