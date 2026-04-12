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

    public double getCalorieTarget() {
        return calorieTarget;
    }

    public void setCalorieTarget(double calorieTarget) {
        this.calorieTarget = calorieTarget;
    }

    public double getProteinTarget() {
        return proteinTarget;
    }

    public void setProteinTarget(double proteinTarget) {
        this.proteinTarget = proteinTarget;
    }

    public double getCarbTarget() {
        return carbTarget;
    }

    public void setCarbTarget(double carbTarget) {
        this.carbTarget = carbTarget;
    }

    public double getFatTarget() {
        return fatTarget;
    }

    public void setFatTarget(double fatTarget) {
        this.fatTarget = fatTarget;
    }
}