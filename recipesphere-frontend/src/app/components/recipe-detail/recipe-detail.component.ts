import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe?: Recipe;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
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
        this.loading = false;
        this.router.navigate(['/recipes']);
      }
    });
  }

  editRecipe() {
    this.router.navigate(['/recipes', this.recipe!.id, 'edit']);
  }

  deleteRecipe() {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(this.recipe!.id!).subscribe({
        next: () => {
          this.router.navigate(['/recipes']);
        },
        error: (error) => console.error('Error deleting recipe:', error)
      });
    }
  }

  goBack() {
    this.router.navigate(['/recipes']);
  }

  getTotalTime(): number {
    return (this.recipe?.prepTime || 0) + (this.recipe?.cookTime || 0);
  }
}