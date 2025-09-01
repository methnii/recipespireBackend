import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { IngredientService } from '../../services/ingredient.service';
import { InventoryItem } from '../../models/inventory.model';
import { Ingredient } from '../../models/ingredient.model';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css']
})
export class InventoryFormComponent implements OnInit {
  inventoryForm: FormGroup;
  ingredients: Ingredient[] = [];
  isEditMode = false;
  inventoryId?: number;
  loading = false;
  
  locations = ['Pantry', 'Fridge', 'Freezer', 'Spice Rack', 'Counter', 'Other'];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private ingredientService: IngredientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.inventoryForm = this.createForm();
  }

  ngOnInit() {
    this.loadIngredients();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.inventoryId = +params['id'];
        this.loadInventoryItem(this.inventoryId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      ingredientId: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0)]],
      location: [''],
      expirationDate: [''],
      minStockLevel: [null, [Validators.min(0)]]
    });
  }

  loadIngredients() {
    this.ingredientService.getAllIngredients().subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients;
      },
      error: (error) => console.error('Error loading ingredients:', error)
    });
  }

  loadInventoryItem(id: number) {
    this.loading = true;
    // Note: We would need to implement getInventoryItemById in the service
    // For now, we'll load all items and find the one we need
    this.inventoryService.getAllInventoryItems().subscribe({
      next: (items) => {
        const item = items.find(i => i.id === id);
        if (item) {
          this.populateForm(item);
        } else {
          this.router.navigate(['/inventory']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading inventory item:', error);
        this.loading = false;
        this.router.navigate(['/inventory']);
      }
    });
  }

  populateForm(item: InventoryItem) {
    this.inventoryForm.patchValue({
      ingredientId: item.ingredient.id,
      quantity: item.quantity,
      location: item.location,
      expirationDate: item.expirationDate ? new Date(item.expirationDate).toISOString().split('T')[0] : '',
      minStockLevel: item.minStockLevel
    });
  }

  onSubmit() {
    if (this.inventoryForm.valid) {
      this.loading = true;
      const formValue = this.inventoryForm.value;
      
      const inventoryItem: any = {
        ingredient: { id: formValue.ingredientId },
        quantity: formValue.quantity,
        location: formValue.location,
        expirationDate: formValue.expirationDate ? new Date(formValue.expirationDate) : null,
        minStockLevel: formValue.minStockLevel
      };

      const operation = this.isEditMode 
        ? this.inventoryService.updateInventoryItem(this.inventoryId!, inventoryItem)
        : this.inventoryService.addToInventory(inventoryItem);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/inventory']);
        },
        error: (error) => {
          console.error('Error saving inventory item:', error);
          this.loading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/inventory']);
  }
}