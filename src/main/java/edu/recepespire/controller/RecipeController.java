package edu.recepespire.controller;

import edu.recepespire.dto.RecipeDTO;
import edu.recepespire.entity.Recipe;
import edu.recepespire.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {
    private final RecipeService recipeService;

    @PostMapping
    public ResponseEntity<Recipe> createRecipe(@Valid @RequestBody RecipeDTO recipeDTO) {
        return ResponseEntity.ok(recipeService.createRecipe(recipeDTO));
    }

    @GetMapping
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        return ResponseEntity.ok(recipeService.getAllRecipes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipeById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recipe> updateRecipe(
            @PathVariable Long id,
            @Valid @RequestBody RecipeDTO recipeDTO) {
        return ResponseEntity.ok(recipeService.updateRecipe(id, recipeDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Recipe>> searchRecipes(@RequestParam String query) {
        return ResponseEntity.ok(recipeService.searchRecipes(query));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Recipe>> getRecipesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(recipeService.getRecipesByCategory(category));
    }
}
