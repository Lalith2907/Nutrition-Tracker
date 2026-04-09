package com.nutrition.tracker.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;

import com.nutrition.tracker.model.FoodItem;
import com.nutrition.tracker.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/food")
@CrossOrigin
public class FoodController {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addFood(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Food name cannot be blank");
        }
        // Check for duplicate food name (case-insensitive) using repository
        FoodItem existing = foodItemRepository.findByNameIgnoreCase(name);
        if (existing != null) {
            return ResponseEntity.badRequest().body("Food with this name already exists");
        }
        FoodItem foodItem = new FoodItem();
        foodItem.setName(name);
        // Optionally set other fields if provided
        if (payload.containsKey("calories")) foodItem.setCalories(Double.parseDouble(payload.get("calories").toString()));
        if (payload.containsKey("protein")) foodItem.setProtein(Double.parseDouble(payload.get("protein").toString()));
        if (payload.containsKey("carbs")) foodItem.setCarbs(Double.parseDouble(payload.get("carbs").toString()));
        if (payload.containsKey("fats")) foodItem.setFats(Double.parseDouble(payload.get("fats").toString()));
        FoodItem saved = foodItemRepository.save(foodItem);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public List<FoodItem> getAllFood() {
        return foodItemRepository.findAll();
    }
}
