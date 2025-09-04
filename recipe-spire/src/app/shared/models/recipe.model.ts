export interface Recipe {
  id?: number;
  title: string;
  description?: string;
  instructions: string;
  category?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  ingredients: RecipeIngredient[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RecipeIngredient {
  id?: number;
  ingredient: {
    id: number;
    name: string;
    unit: string;
  };
  quantity: string;
  notes?: string;
}

export interface RecipeDTO {
  id?: number;
  title: string;
  description?: string;
  instructions: string;
  category?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  ingredients: RecipeIngredientDTO[];
}

export interface RecipeIngredientDTO {
  ingredientId: number;
  quantity: number;
  notes?: string;
}