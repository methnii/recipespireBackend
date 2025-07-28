package edu.recepespire.service;


import edu.recepespire.dto.RecipeDTO;
import edu.recepespire.entity.Recipe;
import java.util.List;

public interface RecipeService {
    Recipe createRecipe(RecipeDTO recipeDTO);
    Recipe updateRecipe(Long id, RecipeDTO recipeDTO);
    void deleteRecipe(Long id);
    Recipe getRecipeById(Long id);
    List<Recipe> getAllRecipes();
    List<Recipe> getRecipesByCategory(String category);
    List<Recipe> searchRecipes(String query);
}