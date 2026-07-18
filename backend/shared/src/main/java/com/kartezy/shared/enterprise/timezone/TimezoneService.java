package com.kartezy.shared.enterprise.timezone;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.time.zone.ZoneRules;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Enterprise timezone conversion service for multi-timezone operations.
 * Handles scheduling across timezones, DST transitions, and conversions.
 */
@Slf4j
@Service
public class TimezoneService {

    private final Map<String, ZoneRules> zoneRules = new ConcurrentHashMap<>();
    private final Set<String> supportedTimezones = new TreeSet<>();

    @PostConstruct
    public void init() {
        initializeTimezones();
        log.info("TimezoneService initialized with {} timezones", supportedTimezones.size());
    }

    /**
     * Convert a ZonedDateTime from one timezone to another.
     */
    public ZonedDateTime convert(ZonedDateTime dateTime, String targetTimezone) {
        ZoneId targetZone = ZoneId.of(targetTimezone);
        return dateTime.withZoneSameInstant(targetZone);
    }

    /**
     * Convert a LocalDateTime from one timezone to another.
     */
    public ZonedDateTime convert(LocalDateTime dateTime, String fromTimezone, String toTimezone) {
        ZoneId fromZone = ZoneId.of(fromTimezone);
        ZoneId toZone = ZoneId.of(toTimezone);
        return dateTime.atZone(fromZone).withZoneSameInstant(toZone);
    }

    /**
     * Get current time in a specific timezone.
     */
    public ZonedDateTime getCurrentTime(String timezone) {
        return ZonedDateTime.now(ZoneId.of(timezone));
    }

    /**
     * Get the offset from UTC for a timezone at a given time.
     */
    public ZoneOffset getOffset(String timezone, ZonedDateTime dateTime) {
        ZoneId zone = ZoneId.of(timezone);
        return zone.getRules().getOffset(dateTime.toInstant());
    }

    /**
     * Check if a timezone is currently in DST.
     */
    public boolean isInDST(String timezone) {
        return isInDST(timezone, ZonedDateTime.now());
    }

    public boolean isInDST(String timezone, ZonedDateTime dateTime) {
        ZoneId zone = ZoneId.of(timezone);
        return zone.getRules().isDaylightSavings(dateTime.toInstant());
    }

    /**
     * Format a date time in the user's timezone.
     */
    public String format(ZonedDateTime dateTime, String pattern) {
        ZonedDateTime converted = convert(dateTime, TimezoneContext.getCurrentTimezone());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        return converted.format(formatter);
    }

    /**
     * Get human-readable timezone display name.
     */
    public String getDisplayName(String timezoneId) {
        ZoneId zone = ZoneId.of(timezoneId);
        return zone.getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " (" +
                getOffset(timezoneId, ZonedDateTime.now()) + ")";
    }

    /**
     * Format duration in a human-readable way considering timezone.
     */
    public String formatDuration(ZonedDateTime start, ZonedDateTime end) {
        Duration duration = Duration.between(start, end);
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;

        if (hours > 0) {
            return String.format("%dh %dm", hours, minutes);
        }
        return String.format("%dm", minutes);
    }

    /**
     * Get all supported timezones grouped by region.
     */
    public Map<String, List<String>> getTimezonesByRegion() {
        Map<String, List<String>> regions = new TreeMap<>();
        for (String tz : supportedTimezones) {
            String[] parts = tz.split("/", 2);
            String region = parts.length > 1 ? parts[0] : "Other";
            String subRegion = parts.length > 1 ? parts[1] : tz;
            regions.computeIfAbsent(region, k -> new ArrayList<>()).add(subRegion);
        }
        return regions;
    }

    private void initializeTimezones() {
        // Indian timezones
        supportedTimezones.addAll(List.of(
                "Asia/Kolkata", "Asia/Kolkata_UTC"
        ));

        // Major world timezones
        supportedTimezones.addAll(List.of(
                "America/New_York", "America/Chicago", "America/Denver",
                "America/Los_Angeles", "America/Toronto", "America/Vancouver",
                "America/Sao_Paulo", "America/Buenos_Aires", "America/Mexico_City",
                "Europe/London", "Europe/Paris", "Europe/Berlin",
                "Europe/Madrid", "Europe/Rome", "Europe/Amsterdam",
                "Europe/Moscow", "Europe/Istanbul",
                "Asia/Dubai", "Asia/Shanghai", "Asia/Tokyo",
                "Asia/Seoul", "Asia/Singapore", "Asia/Hong_Kong",
                "Asia/Bangkok", "Asia/Kuala_Lumpur", "Asia/Jakarta",
                "Asia/Manila", "Asia/Taipei",
                "Australia/Sydney", "Australia/Melbourne", "Australia/Perth",
                "Pacific/Auckland", "Pacific/Fiji", "Pacific/Honolulu",
                "Africa/Cairo", "Africa/Johannesburg", "Africa/Lagos",
                "Atlantic/Reykjavik"
        ));
    }
}
