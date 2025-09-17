import api from './api';

export const ingredientService = {
  // Get all ingredients
  getAllIngredients: () => api.get('/ingredients'),
  
  // Get ingredient by ID
  getIngredientById: (id) => api.get(`/ingredients/${id}`),
  
  // Create single ingredient
  createIngredient: (ingredientData) => api.post('/ingredients/single', ingredientData),
  
  // Create multiple ingredients
  createIngredients: (ingredientsData) => api.post('/ingredients/bulk', ingredientsData),
  
  // Update ingredient
  updateIngredient: (id, ingredientData) => api.put(`/ingredients/${id}`, ingredientData),
  
  // Delete ingredient
  deleteIngredient: (id) => api.delete(`/ingredients/${id}`),
};