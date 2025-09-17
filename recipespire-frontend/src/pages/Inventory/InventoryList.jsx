import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import { useToast } from '../../hooks/useToast';

const InventoryList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, itemId: null });
  
  const { showSuccess, showError } = useToast();

  const statusOptions = [
    { value: 'IN_STOCK', label: 'In Stock', color: 'bg-green-100 text-green-800' },
    { value: 'LOW_STOCK', label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'OUT_OF_STOCK', label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    loadInventoryItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [inventoryItems, searchQuery, selectedStatus]);

  const loadInventoryItems = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getAllInventoryItems();
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error loading inventory items:', error);
      showError('Error', 'Failed to load inventory items');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = inventoryItems;

    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    setFilteredItems(filtered);
  };

  const handleDeleteItem = async () => {
    try {
      await inventoryService.removeFromInventory(deleteDialog.itemId);
      showSuccess('Success', 'Item removed from inventory');
      loadInventoryItems();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      showError('Error', 'Failed to remove item');
    } finally {
      setDeleteDialog({ isOpen: false, itemId: null });
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.label || status;
  };

  const isExpiringSoon = (item) => {
    if (!item.expirationDate) return false;
    const today = new Date();
    const expiration = new Date(item.expirationDate);
    const daysUntilExpiration = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 7 && daysUntilExpiration >= 0;
  };

  const isExpired = (item) => {
    if (!item.expirationDate) return false;
    const today = new Date();
    const expiration = new Date(item.expirationDate);
    return expiration < today;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="mt-2 text-gray-600">Track your ingredient stock levels</p>
        </div>
        <Link
          to="/inventory/new"
          className="mt-4 sm:mt-0 btn-primary inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add to Inventory
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Search Inventory</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ingredient or location..."
                className="form-input pl-10"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="form-label">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-input"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {filteredItems.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingredient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      isExpired(item) ? 'bg-red-50' : isExpiringSoon(item) ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.ingredient.name}</div>
                      <div className="text-sm text-gray-500">{item.ingredient.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                      {item.minStockLevel && (
                        <div className="text-xs text-gray-500">Min: {item.minStockLevel}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.location || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.expirationDate ? (
                        <div>
                          {new Date(item.expirationDate).toLocaleDateString()}
                          {isExpired(item) && (
                            <div className="text-xs text-red-600 font-medium">Expired</div>
                          )}
                          {isExpiringSoon(item) && !isExpired(item) && (
                            <div className="text-xs text-yellow-600 font-medium">Expires soon</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">No expiration</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        to={`/inventory/${item.id}/edit`}
                        className="text-primary-600 hover:text-primary-700 transition-colors duration-200 inline-flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, itemId: item.id })}
                        className="text-red-600 hover:text-red-700 transition-colors duration-200 inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory items found</h3>
          <p className="mt-1 text-sm text-gray-500">Start tracking your ingredients by adding them to inventory.</p>
          <div className="mt-6">
            <Link to="/inventory/new" className="btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Add to Inventory
            </Link>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, itemId: null })}
        onConfirm={handleDeleteItem}
        title="Remove from Inventory"
        message="Are you sure you want to remove this item from inventory? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
      />
    </div>
  );
};

export default InventoryList;