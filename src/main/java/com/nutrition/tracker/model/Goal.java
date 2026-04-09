package com.nutrition.tracker.model;

import jakarta.persistence.*;

@Entity
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int goalId;

    private double calorieTarget;
    private double proteinTarget;
    private double carbTarget;
    private double fatTarget;
}