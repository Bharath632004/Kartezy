package com.kartezy.shared.enterprise.timezone;

import java.time.ZoneId;

/**
 * Thread-local timezone context for multi-timezone support.
 * Tracks the current user's timezone across service boundaries.
 */
public final class TimezoneContext {

    private static final ThreadLocal<String> CURRENT_TIMEZONE = new InheritableThreadLocal<>();

    private TimezoneContext() {}

    public static void setCurrentTimezone(String timezoneId) {
        if (timezoneId != null && !ZoneId.getAvailableZoneIds().contains(timezoneId)) {
            throw new IllegalArgumentException("Invalid timezone: " + timezoneId);
        }
        CURRENT_TIMEZONE.set(timezoneId);
    }

    public static String getCurrentTimezone() {
        String tz = CURRENT_TIMEZONE.get();
        return tz != null ? tz : "Asia/Kolkata"; // Default to India
    }

    public static java.util.TimeZone getTimeZone() {
        return java.util.TimeZone.getTimeZone(getCurrentTimezone());
    }

    public static void clear() {
        CURRENT_TIMEZONE.remove();
    }
}
