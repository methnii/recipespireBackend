package edu.recepespire.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeDTO {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Instructions are required")
    private String instructions;

    private String category;
    private Integer prepTime;
    private Integer cookTime;
    private Integer servings;

    @NotEmpty(message = "At least one ingredient is required")
    private List<RecipeIngredientDTO> ingredients;
}
