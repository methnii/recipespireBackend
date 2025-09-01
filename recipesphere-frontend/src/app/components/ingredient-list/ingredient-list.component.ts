import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ingredient } from '../../models/ingredient.model';
import { IngredientService } from '../../services/ingredient.service';

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

  constructor(
    private ingredientService: IngredientService,
    private router: Router
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

  deleteIngredient(id: number) {
    if (confirm('Are you sure you want to delete this ingredient?')) {
      this.ingredientService.deleteIngredient(id).subscribe({
        next: () => {
          this.loadIngredients();
        },
        error: (error) => console.error('Error deleting ingredient:', error)
      });
    }
  }
}