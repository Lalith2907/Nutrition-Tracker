package com.nutrition.tracker.repository;

import com.nutrition.tracker.model.MealEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MealEntryRepository extends JpaRepository<MealEntry, Integer> {
	@Query("SELECT m FROM MealEntry m WHERE m.meal.mealId = :mealId AND m.foodItem.foodId = :foodId")
	MealEntry findByMealIdAndFoodId(@Param("mealId") int mealId, @Param("foodId") int foodId);

	@Query("SELECT m FROM MealEntry m WHERE m.meal.mealId IN :mealIds")
	List<MealEntry> findAllByMealIds(@Param("mealIds") List<Integer> mealIds);
}
