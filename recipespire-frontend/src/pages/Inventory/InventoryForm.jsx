import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { inventoryService } from '../../services/inventoryService';
import { ingredientService } from '../../services/ingredientService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useToast } from '../../hooks/useToast';

const schema = yup.object({
  ingredientId: yup.string().required('Please select an ingredient'),
  quantity: yup.number().required('Quantity is required').min(0, 'Quantity must be positive'),
  location: yup.string(),
  expirationDate: yup.string(),
  minStockLevel: yup.number().min(0, 'Minimum stock level must be positive').nullable(),
});

const InventoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const { showSuccess, showError } = useToast();

  const locations = ['Pantry', 'Fridge', 'Freezer', 'Spice Rack', 'Counter', 'Other'];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ingredientId: '',
      quantity: '',
      location: '',
      expirationDate: '',
      minStockLevel: null,
    },
  });

  useEffect(() => {
    loadIngredients();
    if (isEditMode) {
      loadInventoryItem();
    } else {
      setInitialLoading(false);
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

  const loadInventoryItem = async () => {
    try {
      setInitialLoading(true);
      // Note: We need to get the item from the list since there's no getById endpoint
      const response = await inventoryService.getAllInventoryItems();
      const item = response.data.find(i => i.id === parseInt(id));
      
      if (item) {
        reset({
          ingredientId: item.ingredient.id.toString(),
          quantity: item.quantity,
          location: item.location || '',
          expirationDate: item.expirationDate ? new Date(item.expirationDate).toISOString().split('T')[0] : '',
          minStockLevel: item.minStockLevel,
        });
      } else {
        showError('Error', 'Inventory item not found');
        navigate('/inventory');
      }
    } catch (error) {
      console.error('Error loading inventory item:', error);
      showError('Error', 'Failed to load inventory item');
      navigate('/inventory');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const inventoryData = {
        ingredient: { id: parseInt(data.ingredientId) },
        quantity: parseFloat(data.quantity),
        location: data.location || null,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
        minStockLevel: data.minStockLevel ? parseFloat(data.minStockLevel) : null,
      };

      if (isEditMode) {
        await inventoryService.updateInventoryItem(id, inventoryData);
        showSuccess('Success', 'Inventory item updated successfully');
      } else {
        await inventoryService.addToInventory(inventoryData);
        showSuccess('Success', 'Item added to inventory successfully');
      }
      
      navigate('/inventory');
    } catch (error) {
      console.error('Error saving inventory item:', error);
      showError('Error', 'Failed to save inventory item');
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
            {isEditMode ? 'Edit Inventory Item' : 'Add to Inventory'}
          </h1>
          <Link
            to="/inventory"
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Ingredient Selection */}
          <div>
            <label className="form-label">Ingredient *</label>
            <select {...register('ingredientId')} className="form-input">
              <option value="">Select an ingredient</option>
              {ingredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name} ({ingredient.unit})
                </option>
              ))}
            </select>
            {errors.ingredientId && (
              <p className="mt-1 text-sm text-red-600">{errors.ingredientId.message}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="form-label">Quantity *</label>
            <input
              type="number"
              {...register('quantity')}
              className="form-input"
              placeholder="Enter quantity"
              step="0.1"
              min="0"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="form-label">Storage Location</label>
            <select {...register('location')} className="form-input">
              <option value="">Select location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Expiration Date */}
          <div>
            <label className="form-label">Expiration Date</label>
            <input
              type="date"
              {...register('expirationDate')}
              className="form-input"
            />
          </div>

          {/* Minimum Stock Level */}
          <div>
            <label className="form-label">Minimum Stock Level</label>
            <input
              type="number"
              {...register('minStockLevel')}
              className="form-input"
              placeholder="Alert when stock falls below this level"
              step="0.1"
              min="0"
            />
            <p className="mt-1 text-sm text-gray-500">
              You'll be notified when stock falls below this level
            </p>
            {errors.minStockLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.minStockLevel.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link to="/inventory" className="btn-secondary">
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
              {loading ? 'Saving...' : (isEditMode ? 'Update Item' : 'Add to Inventory')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;