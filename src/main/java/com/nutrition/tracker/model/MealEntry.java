package com.nutrition.tracker.model;

import jakarta.persistence.*;

@Entity
public class MealEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private double quantity;
    private double subtotalCalories;

    @ManyToOne
    private Meal meal;

    @ManyToOne
    private FoodItem foodItem;

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public double getSubtotalCalories() {
        return subtotalCalories;
    }

    public void setSubtotalCalories(double subtotalCalories) {
        this.subtotalCalories = subtotalCalories;
    }

    public Meal getMeal() {
        return meal;
    }

    public void setMeal(Meal meal) {
        this.meal = meal;
    }

    public FoodItem getFoodItem() {
        return foodItem;
    }

    public void setFoodItem(FoodItem foodItem) {
        this.foodItem = foodItem;
    }
}