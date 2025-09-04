import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient, IngredientDTO } from '../../shared/models/ingredient.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private apiUrl = `${environment.apiBaseUrl}/ingredients`;

  constructor(private http: HttpClient) {}

  getAllIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.apiUrl);
  }

  getIngredientById(id: number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.apiUrl}/${id}`);
  }

  createIngredient(ingredient: IngredientDTO): Observable<Ingredient> {
    return this.http.post<Ingredient>(`${this.apiUrl}/single`, ingredient);
  }

  createIngredients(ingredients: IngredientDTO[]): Observable<Ingredient[]> {
    return this.http.post<Ingredient[]>(`${this.apiUrl}/bulk`, ingredients);
  }

  updateIngredient(id: number, ingredient: IngredientDTO): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.apiUrl}/${id}`, ingredient);
  }

  deleteIngredient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}