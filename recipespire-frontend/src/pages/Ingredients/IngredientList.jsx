import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { ingredientService } from '../../services/ingredientService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import { useToast } from '../../hooks/useToast';

const IngredientList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, ingredientId: null });
  
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadIngredients();
  }, []);

  useEffect(() => {
    filterIngredients();
  }, [ingredients, searchQuery, selectedCategory]);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const response = await ingredientService.getAllIngredients();
      setIngredients(response.data);
      extractCategories(response.data);
    } catch (error) {
      console.error('Error loading ingredients:', error);
      showError('Error', 'Failed to load ingredients');
    } finally {
      setLoading(false);
    }
  };

  const extractCategories = (ingredientsList) => {
    const categorySet = new Set(
      ingredientsList.map(ing => ing.category).filter(cat => cat)
    );
    setCategories(Array.from(categorySet).sort());
  };

  const filterIngredients = () => {
    let filtered = ingredients;

    if (searchQuery.trim()) {
      filtered = filtered.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(ingredient => ingredient.category === selectedCategory);
    }

    setFilteredIngredients(filtered);
  };

  const handleDeleteIngredient = async () => {
    try {
      await ingredientService.deleteIngredient(deleteDialog.ingredientId);
      showSuccess('Success', 'Ingredient deleted successfully');
      loadIngredients();
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      showError('Error', 'Failed to delete ingredient');
    } finally {
      setDeleteDialog({ isOpen: false, ingredientId: null });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ingredients</h1>
          <p className="mt-2 text-gray-600">Manage your ingredient database</p>
        </div>
        <Link
          to="/ingredients/new"
          className="mt-4 sm:mt-0 btn-primary inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Ingredient
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Search Ingredients</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
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

      {/* Ingredients Table */}
      {filteredIngredients.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calories/Unit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIngredients.map((ingredient) => (
                  <tr key={ingredient.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ingredient.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {ingredient.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ingredient.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ingredient.caloriesPerUnit || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        to={`/ingredients/${ingredient.id}/edit`}
                        className="text-primary-600 hover:text-primary-700 transition-colors duration-200 inline-flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, ingredientId: ingredient.id })}
                        className="text-red-600 hover:text-red-700 transition-colors duration-200 inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No ingredients found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first ingredient.</p>
          <div className="mt-6">
            <Link to="/ingredients/new" className="btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Add Ingredient
            </Link>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, ingredientId: null })}
        onConfirm={handleDeleteIngredient}
        title="Delete Ingredient"
        message="Are you sure you want to delete this ingredient? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default IngredientList;