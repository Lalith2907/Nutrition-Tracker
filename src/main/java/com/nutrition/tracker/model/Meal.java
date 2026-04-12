package com.nutrition.tracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int mealId;

    // Per-user meal number
    private int userMealNumber;

    private String mealType;
    private LocalDate date;

    @ManyToOne
    private Member member;

    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<MealEntry> entries;
}