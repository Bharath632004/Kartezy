package com.kartezy.merchantservice.repository;

import com.kartezy.merchantservice.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreRepository extends JpaRepository<Store, UUID> {
    Optional<Store> findByMerchantId(UUID merchantId);
    List<Store> findByCity(String city);
    List<Store> findByCategory(String category);
    List<Store> findByStatus(String status);
    List<Store> findByIsOpenTrue();
    List<Store> findByCityAndIsOpenTrue(String city);
    List<Store> findByIsFeaturedTrue();
}
