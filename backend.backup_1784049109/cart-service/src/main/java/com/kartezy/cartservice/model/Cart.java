package com.kartezy.cartservice.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {
    @Id
    private UUID id;
    private UUID userId; // null for guest cart
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();
    private boolean usedWallet = false;
    private double walletAmount = 0.0;
    @Transient
    public int getItemCount() {
        return items.stream().mapToInt(CartItem::getQuantity).sum();
    }
    @Transient
    public String getTotalAmount() {
        // Calculate total price of items
        double total = items.stream()
                .mapToDouble(item -> item.getProductPrice().doubleValue() * item.getQuantity())
                .sum();
        // Apply wallet amount if used
        if (usedWallet) {
            total = Math.max(0, total - walletAmount);
        }
        return String.format("%.2f", total);
    }
    public void addItem(CartItem item) {
        // Remove existing item with same productId and variants
        items.removeIf(i -> i.getProductId().equals(item.getProductId()) &&
                (item.getVariants() == null ? i.getVariants() == null : item.getVariants().equals(i.getVariants())));
        items.add(item);
        item.setCart(this);
    }
    public void removeItem(UUID cartItemId) {
        items.removeIf(item -> item.getId().equals(cartItemId));
    }
    public void clear() {
        items.clear();
    }
}
