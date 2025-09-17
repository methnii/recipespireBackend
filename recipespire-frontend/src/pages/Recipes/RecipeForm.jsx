import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { recipeService } from '../../services/recipeService';
import { ingredientService } from '../../services/ingredientService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useToast } from '../../hooks/useToast';

const schema = yup.object({
  title: yup.string().required('Title is required').min(2, 'Title must be at least 2 characters'),
  description: yup.string(),
  instructions: yup.string().required('Instructions are required'),
  category: yup.string(),
  prepTime: yup.number().min(0, 'Prep time must be positive').nullable(),
  cookTime: yup.number().min(0, 'Cook time must be positive').nullable(),
  servings: yup.number().min(1, 'Servings must be at least 1').nullable(),
  ingredients: yup.array().of(
    yup.object({
      ingredientId: yup.string().required('Ingredient is required'),
      quantity: yup.number().required('Quantity is required').min(0.1, 'Quantity must be positive'),
      notes: yup.string(),
    })
  ).min(1, 'At least one ingredient is required'),
});

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  
  const { showSuccess, showError } = useToast();

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer'];

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      category: '',
      prepTime: null,
      cookTime: null,
      servings: null,
      ingredients: [{ ingredientId: '', quantity: '', notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  useEffect(() => {
    loadIngredients();
    if (isEditMode) {
      loadRecipe();
    }
  }, [id, isEditMode]);

  const loadIngredients = async () => {
    try {
      const response = await ingredientService.getAllIngredients();
      setIngredients(response.data);
    } catch (error) {
      console.error('Error loading ingredients:', error);
      showError('Error', 'Failed to load ingredients');
    }
  };

  const loadRecipe = async () => {
    try {
      setInitialLoading(true);
      const response = await recipeService.getRecipeById(id);
      const recipe = response.data;
      
      reset({
        title: recipe.title,
        description: recipe.description || '',
        instructions: recipe.instructions,
        category: recipe.category || '',
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        ingredients: recipe.ingredients?.map(ing => ({
          ingredientId: ing.ingredient.id.toString(),
          quantity: parseFloat(ing.quantity),
          notes: ing.notes || '',
        })) || [{ ingredientId: '', quantity: '', notes: '' }],
      });
    } catch (error) {
      console.error('Error loading recipe:', error);
      showError('Error', 'Failed to load recipe');
      navigate('/recipes');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const recipeData = {
        ...data,
        ingredients: data.ingredients.map(ing => ({
          ingredientId: parseInt(ing.ingredientId),
          quantity: parseFloat(ing.quantity),
          notes: ing.notes || null,
        })),
      };

      if (isEditMode) {
        await recipeService.updateRecipe(id, recipeData);
        showSuccess('Success', 'Recipe updated successfully');
      } else {
        await recipeService.createRecipe(recipeData);
        showSuccess('Success', 'Recipe created successfully');
      }
      
      navigate('/recipes');
    } catch (error) {
      console.error('Error saving recipe:', error);
      showError('Error', 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
          </h1>
          <Link
            to="/recipes"
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="form-label">Recipe Title *</label>
              <input
                type="text"
                {...register('title')}
                className="form-input"
                placeholder="Enter recipe title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Category</label>
              <select {...register('category')} className="form-input">
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Servings</label>
              <input
                type="number"
                {...register('servings')}
                className="form-input"
                placeholder="Number of servings"
                min="1"
              />
              {errors.servings && (
                <p className="mt-1 text-sm text-red-600">{errors.servings.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Prep Time (minutes)</label>
              <input
                type="number"
                {...register('prepTime')}
                className="form-input"
                placeholder="Preparation time"
                min="0"
              />
              {errors.prepTime && (
                <p className="mt-1 text-sm text-red-600">{errors.prepTime.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Cook Time (minutes)</label>
              <input
                type="number"
                {...register('cookTime')}
                className="form-input"
                placeholder="Cooking time"
                min="0"
              />
              {errors.cookTime && (
                <p className="mt-1 text-sm text-red-600">{errors.cookTime.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description</label>
            <textarea
              {...register('description')}
              rows="3"
              className="form-input"
              placeholder="Brief description of the recipe"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="form-label">Instructions *</label>
            <textarea
              {...register('instructions')}
              rows="6"
              className="form-input"
              placeholder="Step-by-step cooking instructions"
            />
            {errors.instructions && (
              <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="form-label mb-0">Ingredients *</label>
              <button
                type="button"
                onClick={() => append({ ingredientId: '', quantity: '', notes: '' })}
                className="btn-secondary text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Ingredient
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <label className="form-label">Ingredient</label>
                    <select
                      {...register(`ingredients.${index}.ingredientId`)}
                      className="form-input"
                    >
                      <option value="">Select ingredient</option>
                      {ingredients.map((ingredient) => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} ({ingredient.unit})
                        </option>
                      ))}
                    </select>
                    {errors.ingredients?.[index]?.ingredientId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.ingredients[index].ingredientId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      {...register(`ingredients.${index}.quantity`)}
                      className="form-input"
                      placeholder="Amount"
                      step="0.1"
                      min="0.1"
                    />
                    {errors.ingredients?.[index]?.quantity && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.ingredients[index].quantity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Notes</label>
                    <input
                      type="text"
                      {...register(`ingredients.${index}.notes`)}
                      className="form-input"
                      placeholder="Optional notes"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="w-full btn-danger text-sm flex items-center justify-center"
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {errors.ingredients && (
              <p className="mt-1 text-sm text-red-600">{errors.ingredients.message}</p>
            )}

            {fields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No ingredients added yet. Click "Add Ingredient" to get started.</p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link to="/recipes" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              {loading ? 'Saving...' : (isEditMode ? 'Update Recipe' : 'Create Recipe')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;