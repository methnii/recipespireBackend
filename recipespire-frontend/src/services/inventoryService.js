import api from './api';

export const inventoryService = {
  // Get all inventory items
  getAllInventoryItems: () => api.get('/inventory'),
  
  // Get low stock items
  getLowStockItems: () => api.get('/inventory/low-stock'),
  
  // Add to inventory
  addToInventory: (inventoryData) => api.post('/inventory', inventoryData),
  
  // Update inventory item
  updateInventoryItem: (id, inventoryData) => api.put(`/inventory/${id}`, inventoryData),
  
  // Remove from inventory
  removeFromInventory: (id) => api.delete(`/inventory/${id}`),
};