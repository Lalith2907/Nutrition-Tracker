package com.nutrition.tracker.repository;

import com.nutrition.tracker.model.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Integer> {
	@Query("SELECT m FROM Meal m WHERE m.date BETWEEN :start AND :end AND m.member.userId = :userId")
	List<Meal> getMealsBetweenDates(@Param("start") LocalDate start, @Param("end") LocalDate end, @Param("userId") int userId);

	List<Meal> findByMemberUserId(int userId);
}
