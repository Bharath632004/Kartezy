package com.kartezy.cartservice.dto;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDto {
    private UUID id;
    private UUID userId;
    private List<CartItemDto> items;
    private boolean usedWallet;
    private double walletAmount;
    // Computed properties
    @Transient
    public int getItemCount() {
        return items == null ? 0 : items.stream().mapToInt(CartItemDto::getQuantity).sum();
    }
    @Transient
    public String getTotalAmount() {
        if (items == null || items.isEmpty()) {
            return "0.00";
        }
        BigDecimal total = items.stream()
                .map(item -> item.getProductPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total.setScale(2, BigDecimal.ROUND_HALF_UP).toString();
    }
}
