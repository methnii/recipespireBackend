package edu.recepespire.service.Impl;


import edu.recepespire.dto.RecipeDTO;
import edu.recepespire.dto.RecipeIngredientDTO;
import edu.recepespire.entity.Ingredient;
import edu.recepespire.entity.Recipe;
import edu.recepespire.entity.RecipeIngredient;
import edu.recepespire.exception.ResourceNotFoundException;
import edu.recepespire.repository.IngredientRepository;
import edu.recepespire.repository.RecipeRepository;
import edu.recepespire.service.RecipeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class RecipeServiceImpl implements RecipeService {
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;

    @Override
    @Transactional
    public Recipe createRecipe(RecipeDTO recipeDTO) {
        Recipe recipe = new Recipe();
        mapRecipeDTOToEntity(recipeDTO, recipe);
        return recipeRepository.save(recipe);
    }

    @Override
    @Transactional
    public Recipe updateRecipe(Long id, RecipeDTO recipeDTO) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));
        mapRecipeDTOToEntity(recipeDTO, recipe);
        return recipeRepository.save(recipe);
    }

    private void mapRecipeDTOToEntity(RecipeDTO dto, Recipe entity) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setInstructions(dto.getInstructions());
        entity.setCategory(dto.getCategory());
        entity.setPrepTime(dto.getPrepTime());
        entity.setCookTime(dto.getCookTime());
        entity.setServings(dto.getServings());

        // Clear existing ingredients and add new ones
        entity.getIngredients().clear();
        for (RecipeIngredientDTO ingredientDTO : dto.getIngredients()) {
            Ingredient ingredient = ingredientRepository.findById(ingredientDTO.getIngredientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + ingredientDTO.getIngredientId()));

            RecipeIngredient recipeIngredient = new RecipeIngredient();
            recipeIngredient.setRecipe(entity);
            recipeIngredient.setIngredient(ingredient);
            recipeIngredient.setQuantity(ingredientDTO.getQuantity());
            recipeIngredient.setNotes(ingredientDTO.getNotes());

            entity.getIngredients().add(recipeIngredient);
        }
    }

    @Override
    @Transactional
    public void deleteRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));
        recipeRepository.delete(recipe);
    }

    @Override
    public Recipe getRecipeById(Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found with id: " + id));
    }

    @Override
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    @Override
    public List<Recipe> getRecipesByCategory(String category) {
        return recipeRepository.findByCategory(category);
    }

    @Override
    public List<Recipe> searchRecipes(String query) {
        return recipeRepository.searchRecipes(query);
    }
}