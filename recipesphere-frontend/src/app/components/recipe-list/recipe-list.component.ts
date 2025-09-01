import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  searchQuery = '';
  selectedCategory = '';
  categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer'];
  loading = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.loading = true;
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.filteredRecipes = recipes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.recipeService.searchRecipes(this.searchQuery).subscribe({
        next: (recipes) => {
          this.filteredRecipes = recipes;
        },
        error: (error) => console.error('Error searching recipes:', error)
      });
    } else {
      this.filteredRecipes = this.recipes;
    }
  }

  onCategoryFilter() {
    if (this.selectedCategory) {
      this.recipeService.getRecipesByCategory(this.selectedCategory).subscribe({
        next: (recipes) => {
          this.filteredRecipes = recipes;
        },
        error: (error) => console.error('Error filtering recipes:', error)
      });
    } else {
      this.filteredRecipes = this.recipes;
    }
  }

  viewRecipe(id: number) {
    this.router.navigate(['/recipes', id]);
  }

  editRecipe(id: number) {
    this.router.navigate(['/recipes', id, 'edit']);
  }

  deleteRecipe(id: number) {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(id).subscribe({
        next: () => {
          this.loadRecipes();
        },
        error: (error) => console.error('Error deleting recipe:', error)
      });
    }
  }

  getTotalTime(recipe: Recipe): number {
    return (recipe.prepTime || 0) + (recipe.cookTime || 0);
  }
}