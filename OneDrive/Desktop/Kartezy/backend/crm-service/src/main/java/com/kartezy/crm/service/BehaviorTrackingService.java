package com.kartezy.crm.service;

import com.kartezy.crm.entity.BehaviorEvent;
import com.kartezy.crm.repository.BehaviorEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class BehaviorTrackingService {

    private final BehaviorEventRepository eventRepository;

    @Transactional
    public BehaviorEvent trackEvent(BehaviorEvent event) {
        event.setEventTime(event.getEventTime() != null ? event.getEventTime() : LocalDateTime.now());
        return eventRepository.save(event);
    }

    @Transactional(readOnly = true)
    public Page<BehaviorEvent> getCustomerEvents(Long customerId, Pageable pageable) {
        return eventRepository.findByCustomerIdOrderByEventTimeDesc(customerId, pageable);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getEventTypeDistribution() {
        List<Object[]> counts = eventRepository.getEventTypeCounts();
        Map<String, Long> distribution = new LinkedHashMap<>();
        for (Object[] row : counts) {
            distribution.put((String) row[0], (Long) row[1]);
        }
        return distribution;
    }

    @Transactional(readOnly = true)
    public long getActiveUsersInPeriod(int hours) {
        return eventRepository.countDistinctActiveUsersSince(LocalDateTime.now().minusHours(hours));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getBehaviorAnalytics() {
        LocalDateTime last24h = LocalDateTime.now().minusHours(24);
        LocalDateTime last7d = LocalDateTime.now().minusDays(7);

        Map<String, Object> analytics = new LinkedHashMap<>();
        analytics.put("activeUsers24h", eventRepository.countDistinctActiveUsersSince(last24h));
        analytics.put("activeUsers7d", eventRepository.countDistinctActiveUsersSince(last7d));
        analytics.put("totalEvents", eventRepository.count());
        analytics.put("eventTypes", getEventTypeDistribution());
        return analytics;
    }
}
