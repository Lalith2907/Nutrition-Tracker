package com.nutrition.tracker.controller;

import com.nutrition.tracker.model.Meal;
import com.nutrition.tracker.model.MealEntry;
import com.nutrition.tracker.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/meal")
@CrossOrigin
public class MealController {

    @Autowired
    private MealService mealService;

    @Autowired
    private com.nutrition.tracker.repository.MealRepository mealRepository;

    @PostMapping("/create")
    public Meal createMeal(@RequestBody Meal meal) {
        return mealService.createMeal(meal);
    }

    @PostMapping("/addEntry")
    public MealEntry addEntry(@RequestParam int mealId,
                             @RequestParam int foodId,
                             @RequestParam double quantity) {
        return mealService.addMealEntry(mealId, foodId, quantity);
    }

    @GetMapping("/all")
    public java.util.List<Meal> getAllMeals() {
        return mealRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public java.util.List<Meal> getMealsByUser(@PathVariable int userId) {
        return mealRepository.findByMemberUserId(userId);
    }
}
