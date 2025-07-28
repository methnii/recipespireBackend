package edu.recepespire.service.Impl;


import edu.recepespire.dto.IngredientDTO;
import edu.recepespire.entity.Ingredient;
import edu.recepespire.exception.ResourceNotFoundException;
import edu.recepespire.repository.IngredientRepository;
import edu.recepespire.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientServiceImpl implements IngredientService {
    private final IngredientRepository ingredientRepository;

    @Override
    public Ingredient createIngredient(IngredientDTO dto) {
        Ingredient ingredient = new Ingredient();
        ingredient.setName(dto.getName());
        ingredient.setCategory(dto.getCategory());
        ingredient.setUnit(dto.getUnit());
        ingredient.setCaloriesPerUnit(dto.getCaloriesPerUnit());
        return ingredientRepository.save(ingredient);
    }

    @Override
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    @Override
    public Ingredient getIngredientById(Long id) {
        return ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));
    }

    @Override
    public Ingredient updateIngredient(Long id, IngredientDTO dto) {
        Ingredient ingredient = getIngredientById(id);
        ingredient.setName(dto.getName());
        ingredient.setCategory(dto.getCategory());
        ingredient.setUnit(dto.getUnit());
        ingredient.setCaloriesPerUnit(dto.getCaloriesPerUnit());
        return ingredientRepository.save(ingredient);
    }

    @Override
    public void deleteIngredient(Long id) {
        ingredientRepository.deleteById(id);
    }
}