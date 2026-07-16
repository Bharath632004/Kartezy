package com.kartezy.catalogservice.repository;

import com.kartezy.catalogservice.entity.Product;
import com.kartezy.catalogservice.entity.Product.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    List<Product> findByCategoryId(Long categoryId);

    Page<Product> findByMerchantId(Long merchantId, Pageable pageable);

    List<Product> findByMerchantId(Long merchantId);

    List<Product> findByStatus(ProductStatus status);

    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String description, Pageable pageable);

    List<Product> findByNameContainingIgnoreCase(String name);

    Optional<Product> findBySku(String sku);

    List<Product> findByIsActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stock > 0 ORDER BY p.createdAt DESC")
    List<Product> findAvailableProducts();

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stock <= :threshold")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);

    long countByCategoryId(Long categoryId);

    boolean existsByNameIgnoreCase(String name);
}
