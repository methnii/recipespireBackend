import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Shared Components
import { HeaderComponent } from './shared/components/header/header.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

// Feature Components
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RecipeListComponent } from './features/recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './features/recipes/recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './features/recipes/recipe-form/recipe-form.component';
import { IngredientListComponent } from './features/ingredients/ingredient-list/ingredient-list.component';
import { IngredientFormComponent } from './features/ingredients/ingredient-form/ingredient-form.component';
import { InventoryListComponent } from './features/inventory/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './features/inventory/inventory-form/inventory-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ToastComponent,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    DashboardComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeFormComponent,
    IngredientListComponent,
    IngredientFormComponent,
    InventoryListComponent,
    InventoryFormComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }