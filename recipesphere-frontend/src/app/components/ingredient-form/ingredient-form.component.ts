import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from '../../services/ingredient.service';
import { Ingredient, IngredientDTO } from '../../models/ingredient.model';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css']
})
export class IngredientFormComponent implements OnInit {
  ingredientForm: FormGroup;
  isEditMode = false;
  ingredientId?: number;
  loading = false;
  
  categories = [
    'Dairy', 'Meat', 'Poultry', 'Seafood', 'Vegetables', 'Fruits', 
    'Grains', 'Legumes', 'Nuts', 'Seeds', 'Herbs', 'Spices', 
    'Oils', 'Condiments', 'Beverages', 'Other'
  ];
  
  units = [
    'grams', 'kg', 'ml', 'liters', 'cups', 'tablespoons', 
    'teaspoons', 'pieces', 'slices', 'cloves', 'bunches'
  ];

  constructor(
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ingredientForm = this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.ingredientId = +params['id'];
        this.loadIngredient(this.ingredientId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      category: ['', Validators.required],
      unit: ['', Validators.required],
      caloriesPerUnit: [null, [Validators.min(0)]]
    });
  }

  loadIngredient(id: number) {
    this.loading = true;
    this.ingredientService.getIngredientById(id).subscribe({
      next: (ingredient) => {
        this.ingredientForm.patchValue(ingredient);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ingredient:', error);
        this.loading = false;
        this.router.navigate(['/ingredients']);
      }
    });
  }

  onSubmit() {
    if (this.ingredientForm.valid) {
      this.loading = true;
      const ingredientDTO: IngredientDTO = this.ingredientForm.value;

      const operation = this.isEditMode 
        ? this.ingredientService.updateIngredient(this.ingredientId!, ingredientDTO)
        : this.ingredientService.createIngredient(ingredientDTO);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/ingredients']);
        },
        error: (error) => {
          console.error('Error saving ingredient:', error);
          this.loading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/ingredients']);
  }
}