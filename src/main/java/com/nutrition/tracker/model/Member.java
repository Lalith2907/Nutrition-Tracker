package com.nutrition.tracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
public class Member extends User {

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Meal> meals;

    @OneToOne(cascade = CascadeType.ALL)
    private Goal goal;
    public Member() {}

    public Goal getGoal() {
        return goal;
    }

    public void setGoal(Goal goal) {
        this.goal = goal;
    }
}
