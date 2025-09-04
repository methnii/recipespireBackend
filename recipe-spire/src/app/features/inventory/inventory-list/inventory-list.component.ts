import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryItem, InventoryStatus } from '../../../shared/models/inventory.model';
import { InventoryService } from '../../../core/services/inventory.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchQuery = '';
  selectedStatus = '';
  loading = false;
  showConfirmDialog = false;
  itemToDelete?: number;
  
  statusOptions = [
    { value: InventoryStatus.IN_STOCK, label: 'In Stock', color: 'bg-green-100 text-green-800' },
    { value: InventoryStatus.LOW_STOCK, label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' },
    { value: InventoryStatus.OUT_OF_STOCK, label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
  ];

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadInventoryItems();
  }

  loadInventoryItems() {
    this.loading = true;
    this.inventoryService.getAllInventoryItems().subscribe({
      next: (items) => {
        this.inventoryItems = items;
        this.filteredItems = items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading inventory items:', error);
        this.toastService.showError('Error', 'Failed to load inventory items');
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.filterItems();
  }

  onStatusFilter() {
    this.filterItems();
  }

  filterItems() {
    let filtered = this.inventoryItems;

    if (this.searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(item => item.status === this.selectedStatus);
    }

    this.filteredItems = filtered;
  }

  getStatusColor(status: InventoryStatus): string {
    const statusOption = this.statusOptions.find(option => option.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: InventoryStatus): string {
    const statusOption = this.statusOptions.find(option => option.value === status);
    return statusOption?.label || status;
  }

  editInventoryItem(id: number) {
    this.router.navigate(['/inventory', id, 'edit']);
  }

  confirmDeleteInventoryItem(id: number) {
    this.itemToDelete = id;
    this.showConfirmDialog = true;
  }

  deleteInventoryItem() {
    if (this.itemToDelete) {
      this.inventoryService.removeFromInventory(this.itemToDelete).subscribe({
        next: () => {
          this.toastService.showSuccess('Success', 'Item removed from inventory');
          this.loadInventoryItems();
          this.showConfirmDialog = false;
          this.itemToDelete = undefined;
        },
        error: (error) => {
          console.error('Error deleting inventory item:', error);
          this.toastService.showError('Error', 'Failed to remove item');
          this.showConfirmDialog = false;
        }
      });
    }
  }

  cancelDelete() {
    this.showConfirmDialog = false;
    this.itemToDelete = undefined;
  }

  isExpiringSoon(item: InventoryItem): boolean {
    if (!item.expirationDate) return false;
    const today = new Date();
    const expiration = new Date(item.expirationDate);
    const daysUntilExpiration = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 7 && daysUntilExpiration >= 0;
  }

  isExpired(item: InventoryItem): boolean {
    if (!item.expirationDate) return false;
    const today = new Date();
    const expiration = new Date(item.expirationDate);
    return expiration < today;
  }
}