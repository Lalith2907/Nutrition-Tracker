package com.nutrition.tracker.repository;

import com.nutrition.tracker.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FoodItemRepository extends JpaRepository<FoodItem, Integer> {
	@Query("SELECT f FROM FoodItem f WHERE LOWER(f.name) = LOWER(:name)")
	FoodItem findByNameIgnoreCase(@Param("name") String name);
}
