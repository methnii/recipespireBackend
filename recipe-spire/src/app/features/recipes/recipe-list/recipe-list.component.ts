import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../../shared/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';
import { ToastService } from '../../../shared/services/toast.service';

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
  showConfirmDialog = false;
  recipeToDelete?: number;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private toastService: ToastService
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
        this.toastService.showError('Error', 'Failed to load recipes');
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.filterRecipes();
  }

  onCategoryFilter() {
    this.filterRecipes();
  }

  filterRecipes() {
    let filtered = this.recipes;

    if (this.searchQuery.trim()) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(recipe => recipe.category === this.selectedCategory);
    }

    this.filteredRecipes = filtered;
  }

  viewRecipe(id: number) {
    this.router.navigate(['/recipes', id]);
  }

  editRecipe(id: number) {
    this.router.navigate(['/recipes', id, 'edit']);
  }

  confirmDeleteRecipe(id: number) {
    this.recipeToDelete = id;
    this.showConfirmDialog = true;
  }

  deleteRecipe() {
    if (this.recipeToDelete) {
      this.recipeService.deleteRecipe(this.recipeToDelete).subscribe({
        next: () => {
          this.toastService.showSuccess('Success', 'Recipe deleted successfully');
          this.loadRecipes();
          this.showConfirmDialog = false;
          this.recipeToDelete = undefined;
        },
        error: (error) => {
          console.error('Error deleting recipe:', error);
          this.toastService.showError('Error', 'Failed to delete recipe');
          this.showConfirmDialog = false;
        }
      });
    }
  }

  cancelDelete() {
    this.showConfirmDialog = false;
    this.recipeToDelete = undefined;
  }

  getTotalTime(recipe: Recipe): number {
    return (recipe.prepTime || 0) + (recipe.cookTime || 0);
  }
}