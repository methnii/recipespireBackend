import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ingredientService } from '../../services/ingredientService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useToast } from '../../hooks/useToast';

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  category: yup.string().required('Category is required'),
  unit: yup.string().required('Unit is required'),
  caloriesPerUnit: yup.number().min(0, 'Calories must be positive').nullable(),
});

const IngredientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  
  const { showSuccess, showError } = useToast();

  const categories = [
    'Dairy', 'Meat', 'Poultry', 'Seafood', 'Vegetables', 'Fruits',
    'Grains', 'Legumes', 'Nuts', 'Seeds', 'Herbs', 'Spices',
    'Oils', 'Condiments', 'Beverages', 'Other'
  ];

  const units = [
    'grams', 'kg', 'ml', 'liters', 'cups', 'tablespoons',
    'teaspoons', 'pieces', 'slices', 'cloves', 'bunches'
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      category: '',
      unit: '',
      caloriesPerUnit: null,
    },
  });

  useEffect(() => {
    if (isEditMode) {
      loadIngredient();
    }
  }, [id, isEditMode]);

  const loadIngredient = async () => {
    try {
      setInitialLoading(true);
      const response = await ingredientService.getIngredientById(id);
      const ingredient = response.data;
      
      reset({
        name: ingredient.name,
        category: ingredient.category,
        unit: ingredient.unit,
        caloriesPerUnit: ingredient.caloriesPerUnit,
      });
    } catch (error) {
      console.error('Error loading ingredient:', error);
      showError('Error', 'Failed to load ingredient');
      navigate('/ingredients');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (isEditMode) {
        await ingredientService.updateIngredient(id, data);
        showSuccess('Success', 'Ingredient updated successfully');
      } else {
        await ingredientService.createIngredient(data);
        showSuccess('Success', 'Ingredient created successfully');
      }
      
      navigate('/ingredients');
    } catch (error) {
      console.error('Error saving ingredient:', error);
      showError('Error', 'Failed to save ingredient');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Ingredient' : 'Add New Ingredient'}
          </h1>
          <Link
            to="/ingredients"
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="form-label">Ingredient Name *</label>
            <input
              type="text"
              {...register('name')}
              className="form-input"
              placeholder="Enter ingredient name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="form-label">Category *</label>
            <select {...register('category')} className="form-input">
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Unit */}
          <div>
            <label className="form-label">Unit of Measurement *</label>
            <select {...register('unit')} className="form-input">
              <option value="">Select a unit</option>
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unit && (
              <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
            )}
          </div>

          {/* Calories per Unit */}
          <div>
            <label className="form-label">Calories per Unit (optional)</label>
            <input
              type="number"
              {...register('caloriesPerUnit')}
              className="form-input"
              placeholder="Enter calories per unit"
              step="0.1"
              min="0"
            />
            {errors.caloriesPerUnit && (
              <p className="mt-1 text-sm text-red-600">{errors.caloriesPerUnit.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link to="/ingredients" className="btn-secondary">
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
              {loading ? 'Saving...' : (isEditMode ? 'Update Ingredient' : 'Create Ingredient')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IngredientForm;