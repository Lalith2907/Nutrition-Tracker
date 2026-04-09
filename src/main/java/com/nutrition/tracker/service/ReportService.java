package com.nutrition.tracker.service;

import com.nutrition.tracker.model.Meal;
import com.nutrition.tracker.model.MealEntry;
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

    public Map<String, Double> generateReport(LocalDate start, LocalDate end, String userName) {
        User user = userRepository.findByNameIgnoreCase(userName);
        double totalCalories = 0;
        if (user != null) {
            List<Meal> meals = mealRepository.getMealsBetweenDates(start, end, user.getUserId());
            if (!meals.isEmpty()) {
                List<Integer> mealIds = meals.stream().map(Meal::getMealId).toList();
                List<MealEntry> entries = mealEntryRepository.findAllByMealIds(mealIds);
                for (MealEntry entry : entries) {
                    totalCalories += entry.getSubtotalCalories();
                }
            }
        }
        Map<String, Double> report = new HashMap<>();
        report.put("totalCalories", totalCalories);
        return report;
    }
}
