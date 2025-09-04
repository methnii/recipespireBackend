import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';
import { IngredientService } from '../../core/services/ingredient.service';
import { InventoryService } from '../../core/services/inventory.service';
import { Recipe } from '../../shared/models/recipe.model';
import { Ingredient } from '../../shared/models/ingredient.model';
import { InventoryItem, InventoryStatus } from '../../shared/models/inventory.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalRecipes: 0,
    totalIngredients: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  };
  
  recentRecipes: Recipe[] = [];
  lowStockItems: InventoryItem[] = [];
  loading = false;

  constructor(
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load recipes
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.stats.totalRecipes = recipes.length;
        this.recentRecipes = recipes.slice(-5).reverse(); // Last 5 recipes
      },
      error: (error) => console.error('Error loading recipes:', error)
    });

    // Load ingredients
    this.ingredientService.getAllIngredients().subscribe({
      next: (ingredients) => {
        this.stats.totalIngredients = ingredients.length;
      },
      error: (error) => console.error('Error loading ingredients:', error)
    });

    // Load inventory
    this.inventoryService.getAllInventoryItems().subscribe({
      next: (items) => {
        this.stats.lowStockItems = items.filter(item => item.status === InventoryStatus.LOW_STOCK).length;
        this.stats.outOfStockItems = items.filter(item => item.status === InventoryStatus.OUT_OF_STOCK).length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
        this.loading = false;
      }
    });

    // Load low stock items
    this.inventoryService.getLowStockItems().subscribe({
      next: (items) => {
        this.lowStockItems = items.slice(0, 5); // Show only first 5
      },
      error: (error) => console.error('Error loading low stock items:', error)
    });
  }

  navigateToRecipes() {
    this.router.navigate(['/recipes']);
  }

  navigateToIngredients() {
    this.router.navigate(['/ingredients']);
  }

  navigateToInventory() {
    this.router.navigate(['/inventory']);
  }

  viewRecipe(id: number) {
    this.router.navigate(['/recipes', id]);
  }
}