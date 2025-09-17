import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Edit, Trash2 } from 'lucide-react';
import { recipeService } from '../../services/recipeService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import { useToast } from '../../hooks/useToast';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const response = await recipeService.getRecipeById(id);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error loading recipe:', error);
      showError('Error', 'Failed to load recipe');
      navigate('/recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      await recipeService.deleteRecipe(id);
      showSuccess('Success', 'Recipe deleted successfully');
      navigate('/recipes');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      showError('Error', 'Failed to delete recipe');
    } finally {
      setDeleteDialog(false);
    }
  };

  const getTotalTime = () => {
    return (recipe?.prepTime || 0) + (recipe?.cookTime || 0);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Recipe not found</h3>
        <Link to="/recipes" className="mt-4 btn-primary">
          Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <Link
            to="/recipes"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Recipes
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
          {recipe.description && (
            <p className="text-lg text-gray-600">{recipe.description}</p>
          )}
          
          <div className="flex items-center space-x-6 mt-4">
            {recipe.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {recipe.category}
              </span>
            )}
            {recipe.servings && (
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-1" />
                {recipe.servings} servings
              </div>
            )}
            {getTotalTime() > 0 && (
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-1" />
                {getTotalTime()} min total
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6 sm:mt-0">
          <Link to={`/recipes/${recipe.id}/edit`} className="btn-secondary flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setDeleteDialog(true)}
            className="btn-danger flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Time Information */}
      {(recipe.prepTime || recipe.cookTime) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recipe.prepTime && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{recipe.prepTime}</div>
              <div className="text-sm text-gray-600">Prep Time (min)</div>
            </div>
          )}
          {recipe.cookTime && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{recipe.cookTime}</div>
              <div className="text-sm text-gray-600">Cook Time (min)</div>
            </div>
          )}
          {getTotalTime() > 0 && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{getTotalTime()}</div>
              <div className="text-sm text-gray-600">Total Time (min)</div>
            </div>
          )}
        </div>
      )}

      {/* Ingredients */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
        <div className="space-y-3">
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">
                    {ingredient.ingredient.name}
                  </span>
                  <span className="text-gray-600">
                    {ingredient.quantity} {ingredient.ingredient.unit}
                  </span>
                </div>
                {ingredient.notes && (
                  <span className="text-sm text-gray-500 italic">{ingredient.notes}</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No ingredients listed</p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {recipe.instructions}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDeleteRecipe}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default RecipeDetail;