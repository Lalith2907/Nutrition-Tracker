package com.nutrition.tracker.service;

import com.nutrition.tracker.model.Meal;
import com.nutrition.tracker.model.MealEntry;
import com.nutrition.tracker.model.FoodItem;
import com.nutrition.tracker.repository.MealRepository;
import com.nutrition.tracker.model.Member;
import com.nutrition.tracker.repository.MealEntryRepository;
import com.nutrition.tracker.repository.FoodItemRepository;
import com.nutrition.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MealService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private MealEntryRepository mealEntryRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    public Meal createMeal(Meal meal) {
        if (meal.getMealType() == null || meal.getMealType().trim().isEmpty()) {
            throw new RuntimeException("Meal name cannot be blank");
        }
        // Fetch the actual Member entity from the DB
        Member member = meal.getMember();
        if (member == null || member.getUserId() == 0) {
            throw new RuntimeException("Member is required");
        }
        Member realMember = (Member) userRepository.findById(member.getUserId()).orElse(null);
        if (realMember == null) {
            throw new RuntimeException("Member not found");
        }
        // Prevent duplicate meal names for the same user
        java.util.List<Meal> existingMeals = mealRepository.findByMemberUserId(realMember.getUserId());
        boolean duplicate = existingMeals.stream().anyMatch(m ->
            m.getMealType() != null && m.getMealType().equalsIgnoreCase(meal.getMealType())
        );
        if (duplicate) {
            throw new RuntimeException("Meal with this name already exists for this user");
        }
        meal.setMember(realMember);
        if (meal.getDate() == null) {
            meal.setDate(java.time.LocalDate.now());
        }
        // Set per-user meal number
        int maxUserMealNumber = existingMeals.stream()
            .mapToInt(m -> m.getUserMealNumber())
            .max().orElse(0);
        meal.setUserMealNumber(maxUserMealNumber + 1);
        return mealRepository.save(meal);
    }

    public MealEntry addMealEntry(int mealId, int foodId, double quantity) {
        Meal meal = mealRepository.findById(mealId).orElse(null);
        FoodItem food = foodItemRepository.findById(foodId).orElse(null);
        MealEntry entry = new MealEntry();
        entry.setMeal(meal);
        entry.setFoodItem(food);
        entry.setQuantity(quantity);
        double subtotal = food.getCalories() * quantity;
        entry.setSubtotalCalories(subtotal);
        return mealEntryRepository.save(entry);
    }
}
