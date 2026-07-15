package com.kartezy.merchantservice.repository;

import com.kartezy.merchantservice.entity.StoreBusinessHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreBusinessHoursRepository extends JpaRepository<StoreBusinessHours, UUID> {
    List<StoreBusinessHours> findByStoreId(UUID storeId);
    Optional<StoreBusinessHours> findByStoreIdAndDayOfWeek(UUID storeId, java.time.DayOfWeek dayOfWeek);
}
