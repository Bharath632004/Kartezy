package com.kartezy.cartservice.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDto {

    private UUID id;
    private String productId;
    private String productName;
    private String productImage;
    private BigDecimal productPrice;
    private int quantity;
    private Map<String, String> variants;

}
