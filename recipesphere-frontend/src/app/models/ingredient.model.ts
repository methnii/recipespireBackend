export interface Ingredient {
  id?: number;
  name: string;
  category: string;
  unit: string;
  caloriesPerUnit?: number;
}

export interface IngredientDTO {
  id?: number;
  name: string;
  category: string;
  unit: string;
  caloriesPerUnit?: number;
}