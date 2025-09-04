import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../../core/services/recipe.service';
import { IngredientService } from '../../../core/services/ingredient.service';
import { Recipe, RecipeDTO } from '../../../shared/models/recipe.model';
import { Ingredient } from '../../../shared/models/ingredient.model';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  ingredients: Ingredient[] = [];
  categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer'];
  isEditMode = false;
  recipeId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.recipeForm = this.createForm();
  }

  ngOnInit() {
    this.loadIngredients();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.recipeId = +params['id'];
        this.loadRecipe(this.recipeId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      instructions: ['', Validators.required],
      category: [''],
      prepTime: [null, [Validators.min(0)]],
      cookTime: [null, [Validators.min(0)]],
      servings: [null, [Validators.min(1)]],
      ingredients: this.fb.array([])
    });
  }

  get ingredientsArray(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  loadIngredients() {
    this.ingredientService.getAllIngredients().subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients;
      },
      error: (error) => {
        console.error('Error loading ingredients:', error);
        this.toastService.showError('Error', 'Failed to load ingredients');
      }
    });
  }

  loadRecipe(id: number) {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.populateForm(recipe);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recipe:', error);
        this.toastService.showError('Error', 'Failed to load recipe');
        this.loading = false;
      }
    });
  }

  populateForm(recipe: Recipe) {
    this.recipeForm.patchValue({
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      category: recipe.category,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings
    });

    // Clear existing ingredients
    while (this.ingredientsArray.length !== 0) {
      this.ingredientsArray.removeAt(0);
    }

    // Add recipe ingredients
    recipe.ingredients.forEach(ingredient => {
      this.addIngredient(ingredient.ingredient.id, +ingredient.quantity, ingredient.notes);
    });
  }

  addIngredient(ingredientId?: number, quantity?: number, notes?: string) {
    const ingredientGroup = this.fb.group({
      ingredientId: [ingredientId || '', Validators.required],
      quantity: [quantity || null, [Validators.required, Validators.min(0.1)]],
      notes: [notes || '']
    });
    this.ingredientsArray.push(ingredientGroup);
  }

  removeIngredient(index: number) {
    this.ingredientsArray.removeAt(index);
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      this.loading = true;
      const formValue = this.recipeForm.value;
      
      const recipeDTO: RecipeDTO = {
        title: formValue.title,
        description: formValue.description,
        instructions: formValue.instructions,
        category: formValue.category,
        prepTime: formValue.prepTime,
        cookTime: formValue.cookTime,
        servings: formValue.servings,
        ingredients: formValue.ingredients
      };

      const operation = this.isEditMode 
        ? this.recipeService.updateRecipe(this.recipeId!, recipeDTO)
        : this.recipeService.createRecipe(recipeDTO);

      operation.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Recipe updated successfully' : 'Recipe created successfully';
          this.toastService.showSuccess('Success', message);
          this.router.navigate(['/recipes']);
        },
        error: (error) => {
          console.error('Error saving recipe:', error);
          this.toastService.showError('Error', 'Failed to save recipe');
          this.loading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/recipes']);
  }
}