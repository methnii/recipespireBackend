import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RecipeListComponent } from './features/recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './features/recipes/recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './features/recipes/recipe-form/recipe-form.component';
import { IngredientListComponent } from './features/ingredients/ingredient-list/ingredient-list.component';
import { IngredientFormComponent } from './features/ingredients/ingredient-form/ingredient-form.component';
import { InventoryListComponent } from './features/inventory/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './features/inventory/inventory-form/inventory-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/new', component: RecipeFormComponent },
  { path: 'recipes/:id', component: RecipeDetailComponent },
  { path: 'recipes/:id/edit', component: RecipeFormComponent },
  { path: 'ingredients', component: IngredientListComponent },
  { path: 'ingredients/new', component: IngredientFormComponent },
  { path: 'ingredients/:id/edit', component: IngredientFormComponent },
  { path: 'inventory', component: InventoryListComponent },
  { path: 'inventory/new', component: InventoryFormComponent },
  { path: 'inventory/:id/edit', component: InventoryFormComponent },
  { path: '**', redirectTo: '/dashboard' }
];