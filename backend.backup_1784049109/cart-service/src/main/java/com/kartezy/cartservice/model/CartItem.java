package com.kartezy.cartservice.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;
    private String productId;
    private String productName;
    private String productImage;
    private BigDecimal productPrice;
    private int quantity;
    @ElementCollection
    @CollectionTable(name = "cart_item_variants", joinColumns = @JoinColumn(name = "cart_item_id"))
    @MapKeyColumn(name = "variant_key")
    @Column(name = "variant_value")
    private Map<String, String> variants;
    // Default constructor for JPA
    protected CartItem() {}
}
