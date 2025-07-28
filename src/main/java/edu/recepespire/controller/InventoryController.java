package edu.recepespire.controller;

import edu.recepespire.entity.InventoryItem;
import edu.recepespire.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAllInventoryItems() {
        return ResponseEntity.ok(inventoryService.getAllInventoryItems());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryItem>> getLowStockItems() {
        return ResponseEntity.ok(inventoryService.getLowStockItems());
    }

    @PostMapping
    public ResponseEntity<InventoryItem> addToInventory(@RequestBody InventoryItem item) {
        return ResponseEntity.ok(inventoryService.addToInventory(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> updateInventoryItem(
            @PathVariable Long id,
            @RequestBody InventoryItem item) {
        return ResponseEntity.ok(inventoryService.updateInventoryItem(id, item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromInventory(@PathVariable Long id) {
        inventoryService.removeFromInventory(id);
        return ResponseEntity.noContent().build();
    }
}
