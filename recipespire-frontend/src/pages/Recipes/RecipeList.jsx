import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Clock, Users, Edit, Trash2 } from 'lucide-react';
import { recipeService } from '../../services/recipeService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import { useToast } from '../../hooks/useToast';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, recipeId: null });
  
  const { showSuccess, showError } = useToast();

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer'];

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchQuery, selectedCategory]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipeService.getAllRecipes();
      setRecipes(response.data);
    } catch (error) {
      console.error('Error loading recipes:', error);
      showError('Error', 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (searchQuery.trim()) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    setFilteredRecipes(filtered);
  };

  const handleDeleteRecipe = async () => {
    try {
      await recipeService.deleteRecipe(deleteDialog.recipeId);
      showSuccess('Success', 'Recipe deleted successfully');
      loadRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      showError('Error', 'Failed to delete recipe');
    } finally {
      setDeleteDialog({ isOpen: false, recipeId: null });
    }
  };

  const getTotalTime = (recipe) => {
    return (recipe.prepTime || 0) + (recipe.cookTime || 0);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
          <p className="mt-2 text-gray-600">Discover and manage your favorite recipes</p>
        </div>
        <Link
          to="/recipes/new"
          className="mt-4 sm:mt-0 btn-primary inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Recipe
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Search Recipes</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or description..."
                className="form-input pl-10"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="form-label">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="card hover:shadow-lg transition-shadow duration-300">
              <Link to={`/recipes/${recipe.id}`} className="block">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200">
                    {recipe.title}
                  </h3>
                  {recipe.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {recipe.category}
                    </span>
                  )}
                </div>
                
                {recipe.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {recipe.description}
                  </p>
                )}
                
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  {recipe.servings && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {recipe.servings} servings
                    </div>
                  )}
                  {getTotalTime(recipe) > 0 && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {getTotalTime(recipe)} min
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <Link
                  to={`/recipes/${recipe.id}/edit`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteDialog({ isOpen: true, recipeId: recipe.id })}
                  className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <ChefHat className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recipes found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first recipe.</p>
          <div className="mt-6">
            <Link to="/recipes/new" className="btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Add Recipe
            </Link>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, recipeId: null })}
        onConfirm={handleDeleteRecipe}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default RecipeList;