package com.kartezy.trackingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tracking_events", indexes = {
    @Index(name = "idx_tracking_order", columnList = "orderId"),
    @Index(name = "idx_tracking_partner", columnList = "deliveryPartnerId"),
    @Index(name = "idx_tracking_timestamp", columnList = "timestamp")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID orderId;

    private UUID deliveryPartnerId;

    @Column(length = 50)
    private String status;

    private Double latitude;

    private Double longitude;

    @Column(length = 255)
    private String locationDescription;

    @Column(length = 50)
    @Builder.Default
    private String eventType = "LOCATION_UPDATE";

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (timestamp == null) timestamp = LocalDateTime.now();
    }
}
