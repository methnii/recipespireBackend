package edu.recepespire.repository;

import edu.recepespire.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByCategory(String category);

    @Query("SELECT r FROM Recipe r WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Recipe> searchRecipes(@Param("query") String query);
}
