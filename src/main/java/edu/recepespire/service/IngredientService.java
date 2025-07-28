package edu.recepespire.service;

import edu.recepespire.dto.IngredientDTO;
import edu.recepespire.entity.Ingredient;

import java.util.List;

public interface IngredientService {
    Ingredient createIngredient(IngredientDTO dto);
    List<Ingredient> getAllIngredients();
    Ingredient getIngredientById(Long id);
    Ingredient updateIngredient(Long id, IngredientDTO dto);
    void deleteIngredient(Long id);
}