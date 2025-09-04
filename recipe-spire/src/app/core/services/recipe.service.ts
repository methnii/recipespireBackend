import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe, RecipeDTO } from '../../shared/models/recipe.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = `${environment.apiBaseUrl}/recipes`;

  constructor(private http: HttpClient) {}

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  createRecipe(recipe: RecipeDTO): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe);
  }

  updateRecipe(id: number, recipe: RecipeDTO): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, recipe);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchRecipes(query: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/search?query=${query}`);
  }

  getRecipesByCategory(category: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/category/${category}`);
  }
}