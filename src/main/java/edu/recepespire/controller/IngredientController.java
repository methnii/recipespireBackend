package edu.recepespire.controller;

import edu.recepespire.dto.IngredientDTO;
import edu.recepespire.entity.Ingredient;
import edu.recepespire.service.IngredientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor

public class IngredientController {
    private final IngredientService ingredientService;

    // For single ingredient creation
    @PostMapping("/single")
    public ResponseEntity<Ingredient> createIngredient(
            @Valid @RequestBody IngredientDTO dto) {
        return ResponseEntity.ok(ingredientService.createIngredient(dto));
    }

    // For bulk ingredient creation
    @PostMapping("/bulk")
    public ResponseEntity<List<Ingredient>> createIngredients(
            @Valid @RequestBody List<IngredientDTO> dtos) {
        List<Ingredient> created = dtos.stream()
                .map(ingredientService::createIngredient)
                .collect(Collectors.toList());
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Ingredient>> getAllIngredients() {
        return ResponseEntity.ok(ingredientService.getAllIngredients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingredient> getIngredientById(@PathVariable Long id) {
        return ResponseEntity.ok(ingredientService.getIngredientById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ingredient> updateIngredient(
            @PathVariable Long id,
            @Valid @RequestBody IngredientDTO dto) {
        return ResponseEntity.ok(ingredientService.updateIngredient(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIngredient(@PathVariable Long id) {
        ingredientService.deleteIngredient(id);
        return ResponseEntity.noContent().build();
    }
}