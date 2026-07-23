package com.kartezy.pricingservice.repository;

import com.kartezy.pricingservice.entity.ProductPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductPriceRepository extends JpaRepository<ProductPrice, UUID> {
    Optional<ProductPrice> findByProductIdAndMerchantIdAndActiveTrue(UUID productId, UUID merchantId);
    Optional<ProductPrice> findByProductIdAndActiveTrue(UUID productId);
}
