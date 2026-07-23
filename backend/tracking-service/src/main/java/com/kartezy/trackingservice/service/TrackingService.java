package com.kartezy.trackingservice.service;

import com.kartezy.trackingservice.dto.TrackingEventDto;
import com.kartezy.trackingservice.entity.TrackingEvent;
import com.kartezy.trackingservice.repository.TrackingEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrackingService {

    private final TrackingEventRepository trackingRepository;

    @Transactional
    public TrackingEventDto recordEvent(TrackingEventDto request) {
        TrackingEvent event = TrackingEvent.builder()
            .orderId(request.getOrderId())
            .deliveryPartnerId(request.getDeliveryPartnerId())
            .status(request.getStatus())
            .latitude(request.getLatitude())
            .longitude(request.getLongitude())
            .locationDescription(request.getLocationDescription())
            .eventType(request.getEventType() != null ? request.getEventType() : "LOCATION_UPDATE")
            .timestamp(LocalDateTime.now())
            .build();
        event = trackingRepository.save(event);
        return toDto(event);
    }

    public List<TrackingEventDto> getOrderTrack(UUID orderId) {
        return trackingRepository.findByOrderIdOrderByTimestampAsc(orderId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<TrackingEventDto> getRecentTrack(UUID orderId, int minutes) {
        return trackingRepository.findByOrderIdAndTimestampAfter(orderId, LocalDateTime.now().minusMinutes(minutes))
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<TrackingEventDto> getDeliveryPartnerTrack(UUID deliveryPartnerId) {
        return trackingRepository.findByDeliveryPartnerIdOrderByTimestampDesc(deliveryPartnerId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    private TrackingEventDto toDto(TrackingEvent event) {
        return TrackingEventDto.builder()
            .id(event.getId()).orderId(event.getOrderId())
            .deliveryPartnerId(event.getDeliveryPartnerId())
            .status(event.getStatus()).latitude(event.getLatitude())
            .longitude(event.getLongitude())
            .locationDescription(event.getLocationDescription())
            .eventType(event.getEventType()).timestamp(event.getTimestamp())
            .build();
    }
}
