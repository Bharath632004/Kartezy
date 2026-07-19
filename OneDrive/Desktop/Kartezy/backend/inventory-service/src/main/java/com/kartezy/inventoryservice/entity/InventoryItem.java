package com.kartezy.inventoryservice.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity
@Table(name = "inventory_items", uniqueConstraints = @UniqueConstraint(columnNames = {"sku"}))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100, unique = true)
    private String sku;
    @Column(nullable = false, length = 200)
    private String productName;
    @Column(nullable = false)
    private Integer quantity;
    @Column(nullable = false)
    private Integer reservedQuantity;
    @Column(nullable = false)
    private Integer availableQuantity;
    @Column(length = 100)
    private String location;
    @Column(nullable = false)
    private Boolean lowStockAlertEnabled = true;
    @Column(nullable = false)
    private Integer lowStockThreshold = 10;
}