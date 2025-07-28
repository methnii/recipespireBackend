package edu.recepespire.entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.*;

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
    private List<RecipeIngredient> recipeIngredients = new ArrayList<>();

    @OneToMany(mappedBy = "ingredient")
    private List<InventoryItem> inventoryItems = new ArrayList<>();
}