import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../../shared/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe?: Recipe;
  loading = false;
  showConfirmDialog = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadRecipe(+params['id']);
      }
    });
  }

  loadRecipe(id: number) {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recipe:', error);
        this.toastService.showError('Error', 'Failed to load recipe');
        this.loading = false;
        this.router.navigate(['/recipes']);
      }
    });
  }

  editRecipe() {
    this.router.navigate(['/recipes', this.recipe!.id, 'edit']);
  }

  confirmDeleteRecipe() {
    this.showConfirmDialog = true;
  }

  deleteRecipe() {
    if (this.recipe?.id) {
      this.recipeService.deleteRecipe(this.recipe.id).subscribe({
        next: () => {
          this.toastService.showSuccess('Success', 'Recipe deleted successfully');
          this.router.navigate(['/recipes']);
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
  }

  goBack() {
    this.router.navigate(['/recipes']);
  }

  getTotalTime(): number {
    return (this.recipe?.prepTime || 0) + (this.recipe?.cookTime || 0);
  }
}