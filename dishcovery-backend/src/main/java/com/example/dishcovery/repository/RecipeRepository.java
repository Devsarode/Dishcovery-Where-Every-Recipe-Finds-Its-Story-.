package com.example.dishcovery.repository;

import com.example.dishcovery.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
  List<Recipe> findByOwnerUsername(String username);
  List<Recipe> findByTitleContainingIgnoreCase(String title);
}
