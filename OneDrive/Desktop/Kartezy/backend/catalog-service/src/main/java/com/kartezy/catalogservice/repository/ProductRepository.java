package com.kartezy.catalogservice.repository;

import com.kartezy.catalogservice.entity.Product;
import com.kartezy.catalogservice.entity.Product.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    Optional<Product> findByBarcode(String barcode);
    List<Product> findTop10ByNameStartingWithIgnoreCase(String name);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByMerchantId(Long merchantId);
    List<Product> findByStatus(ProductStatus status);
    Optional<Product> findBySku(String sku);
}