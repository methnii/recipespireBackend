package edu.recepespire.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeIngredientDTO {
    @NotNull(message = "Ingredient ID is required")
    private Long ingredientId;

    @Positive(message = "Quantity must be positive")
    private Double quantity;

    @Size(max = 100, message = "Notes too long")
    private String notes;
}