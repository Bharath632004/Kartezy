package com.kartezy.analyticsservice.service;

import com.kartezy.analyticsservice.dto.AnalyticsEventDto;
import com.kartezy.analyticsservice.dto.DashboardMetricsDto;
import com.kartezy.analyticsservice.entity.AnalyticsEvent;
import com.kartezy.analyticsservice.repository.AnalyticsEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsEventRepository eventRepository;

    @Transactional
    public void trackEvent(AnalyticsEventDto dto) {
        AnalyticsEvent event = AnalyticsEvent.builder()
            .eventType(dto.getEventType())
            .userId(dto.getUserId())
            .sessionId(dto.getSessionId())
            .eventData(dto.getEventData())
            .pageUrl(dto.getPageUrl())
            .build();
        eventRepository.save(event);
        log.debug("Analytics event tracked: {}", dto.getEventType());
    }

    public DashboardMetricsDto getDashboardMetrics(LocalDateTime start, LocalDateTime end) {
        List<AnalyticsEvent> events = eventRepository.findByCreatedAtBetween(start, end);

        Map<String, Long> eventsByType = events.stream()
            .collect(Collectors.groupingBy(AnalyticsEvent::getEventType, Collectors.counting()));

        Map<String, Long> pageViewsByUrl = events.stream()
            .filter(e -> e.getPageUrl() != null)
            .collect(Collectors.groupingBy(AnalyticsEvent::getPageUrl, Collectors.counting()));

        return DashboardMetricsDto.builder()
            .totalPageViews(events.size())
            .uniqueVisitors(events.stream().map(AnalyticsEvent::getUserId).distinct().count())
            .eventsByType(eventsByType)
            .pageViewsByUrl(pageViewsByUrl)
            .build();
    }
}
