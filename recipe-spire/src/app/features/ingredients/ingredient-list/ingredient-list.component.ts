import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ingredient } from '../../../shared/models/ingredient.model';
import { IngredientService } from '../../../core/services/ingredient.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent implements OnInit {
  ingredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];
  searchQuery = '';
  selectedCategory = '';
  categories: string[] = [];
  loading = false;
  showConfirmDialog = false;
  ingredientToDelete?: number;

  constructor(
    private ingredientService: IngredientService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadIngredients();
  }

  loadIngredients() {
    this.loading = true;
    this.ingredientService.getAllIngredients().subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients;
        this.filteredIngredients = ingredients;
        this.extractCategories();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
        this.toastService.showError('Error', 'Failed to load ingredients');
        this.loading = false;
      }
    });
  }

  extractCategories() {
    const categorySet = new Set(this.ingredients.map(ing => ing.category).filter(cat => cat));
    this.categories = Array.from(categorySet).sort();
  }

  onSearch() {
    this.filterIngredients();
  }

  onCategoryFilter() {
    this.filterIngredients();
  }

  filterIngredients() {
    let filtered = this.ingredients;

    if (this.searchQuery.trim()) {
      filtered = filtered.filter(ingredient =>
        ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(ingredient => ingredient.category === this.selectedCategory);
    }

    this.filteredIngredients = filtered;
  }

  editIngredient(id: number) {
    this.router.navigate(['/ingredients', id, 'edit']);
  }

  confirmDeleteIngredient(id: number) {
    this.ingredientToDelete = id;
    this.showConfirmDialog = true;
  }

  deleteIngredient() {
    if (this.ingredientToDelete) {
      this.ingredientService.deleteIngredient(this.ingredientToDelete).subscribe({
        next: () => {
          this.toastService.showSuccess('Success', 'Ingredient deleted successfully');
          this.loadIngredients();
          this.showConfirmDialog = false;
          this.ingredientToDelete = undefined;
        },
        error: (error) => {
          console.error('Error deleting ingredient:', error);
          this.toastService.showError('Error', 'Failed to delete ingredient');
          this.showConfirmDialog = false;
        }
      });
    }
  }

  cancelDelete() {
    this.showConfirmDialog = false;
    this.ingredientToDelete = undefined;
  }
}