import api from './api';

export const recipeService = {
  // Get all recipes
  getAllRecipes: () => api.get('/recipes'),
  
  // Get recipe by ID
  getRecipeById: (id) => api.get(`/recipes/${id}`),
  
  // Create new recipe
  createRecipe: (recipeData) => api.post('/recipes', recipeData),
  
  // Update recipe
  updateRecipe: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
  
  // Delete recipe
  deleteRecipe: (id) => api.delete(`/recipes/${id}`),
  
  // Search recipes
  searchRecipes: (query) => api.get(`/recipes/search?query=${query}`),
  
  // Get recipes by category
  getRecipesByCategory: (category) => api.get(`/recipes/category/${category}`),
};