package edu.recepespire.service.Impl;


import edu.recepespire.entity.InventoryItem;
import edu.recepespire.exception.ResourceNotFoundException;
import edu.recepespire.repository.InventoryRepository;
import edu.recepespire.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {
    private final InventoryRepository inventoryRepository;

    @Override
    public List<InventoryItem> getAllInventoryItems() {
        return inventoryRepository.findAll();
    }

    @Override
    public List<InventoryItem> getLowStockItems() {
        return inventoryRepository.findByStatus(InventoryItem.InventoryStatus.LOW_STOCK);
    }

    @Override
    public InventoryItem addToInventory(InventoryItem item) {
        return inventoryRepository.save(item);
    }

    @Override
    public InventoryItem updateInventoryItem(Long id, InventoryItem item) {
        InventoryItem existing = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));
        existing.setQuantity(item.getQuantity());
        existing.setExpirationDate(item.getExpirationDate());
        existing.setLocation(item.getLocation());
        existing.setMinStockLevel(item.getMinStockLevel());
        return inventoryRepository.save(existing);
    }

    @Override
    public void removeFromInventory(Long id) {
        inventoryRepository.deleteById(id);
    }
}