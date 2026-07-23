package com.kartezy.trackingservice.repository;

import com.kartezy.trackingservice.entity.TrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TrackingEventRepository extends JpaRepository<TrackingEvent, UUID> {
    List<TrackingEvent> findByOrderIdOrderByTimestampAsc(UUID orderId);
    List<TrackingEvent> findByDeliveryPartnerIdOrderByTimestampDesc(UUID deliveryPartnerId);
    List<TrackingEvent> findByOrderIdAndTimestampAfter(UUID orderId, LocalDateTime after);
}
