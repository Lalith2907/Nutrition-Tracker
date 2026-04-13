package com.nutrition.tracker.service;

import com.nutrition.tracker.model.MealEntry;
import com.nutrition.tracker.repository.MealEntryRepository;
import com.nutrition.tracker.repository.MealRepository;
import com.nutrition.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private MealEntryRepository mealEntryRepository;

    public Map<String, Object> getSystemReport() {
        long totalUsers = userRepository.count();
        long totalMeals = mealRepository.count();

        double totalCalories = 0;
        List<MealEntry> entries = mealEntryRepository.findAll();

        for (MealEntry entry : entries) {
            totalCalories += entry.getSubtotalCalories();
        }

        double avgCalories = entries.size() > 0 ? totalCalories / entries.size() : 0;

        Map<String, Object> report = new HashMap<>();
        report.put("totalUsers", totalUsers);
        report.put("totalMeals", totalMeals);
        report.put("avgCalories", avgCalories);

        return report;
    }
}