package edu.recepespire.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    private Double quantity;
    private Date expirationDate;
    private String location; // e.g., Pantry, Fridge, Freezer
    private Double minStockLevel;

    @Enumerated(EnumType.STRING)
    private InventoryStatus status;

    public enum InventoryStatus {
        IN_STOCK, LOW_STOCK, OUT_OF_STOCK
    }

    @PreUpdate
    @PrePersist
    public void updateStatus() {
        if (quantity <= 0) {
            status = InventoryStatus.OUT_OF_STOCK;
        } else if (quantity <= minStockLevel) {
            status = InventoryStatus.LOW_STOCK;
        } else {
            status = InventoryStatus.IN_STOCK;
        }
    }
}
