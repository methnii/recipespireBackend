package edu.recepespire.repository;

import edu.recepespire.entity.InventoryItem;
import edu.recepespire.entity.InventoryItem.InventoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Date;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByStatus(InventoryStatus status);
    List<InventoryItem> findByExpirationDateBefore(Date date);
    List<InventoryItem> findByIngredientId(Long ingredientId);
}
