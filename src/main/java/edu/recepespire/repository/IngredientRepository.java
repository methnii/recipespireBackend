package edu.recepespire.repository;

import edu.recepespire.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findByNameContainingIgnoreCase(String name);
    List<Ingredient> findByCategory(String category);
}