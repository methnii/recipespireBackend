package edu.recepespire.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category; // e.g., Dairy, Vegetable, Spice
    private String unit; // e.g., grams, ml, cups
    private Double caloriesPerUnit;

    @OneToMany(mappedBy = "ingredient")
    @JsonIgnore  // ADD THIS ANNOTATION
    private List<RecipeIngredient> recipeIngredients = new ArrayList<>();

    @OneToMany(mappedBy = "ingredient")
    @JsonIgnore  // ADD THIS ANNOTATION
    private List<InventoryItem> inventoryItems = new ArrayList<>();
}