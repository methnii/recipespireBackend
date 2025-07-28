package edu.recepespire.service;

import edu.recepespire.entity.InventoryItem;

import java.util.List;

public interface InventoryService {
    List<InventoryItem> getAllInventoryItems();
    List<InventoryItem> getLowStockItems();
    InventoryItem addToInventory(InventoryItem item);
    InventoryItem updateInventoryItem(Long id, InventoryItem item);
    void removeFromInventory(Long id);
}