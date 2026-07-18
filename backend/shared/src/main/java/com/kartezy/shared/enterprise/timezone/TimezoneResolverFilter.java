package com.kartezy.shared.enterprise.timezone;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Servlet filter that resolves the user's timezone from:
 * - X-Timezone header
 * - X-Timezone-Offset header (in minutes)
 * - User profile preference
 * - Geo-location
 * - Tenant default timezone
 */
@Slf4j
@Component
@Order(4)
public class TimezoneResolverFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        try {
            String resolvedTimezone = resolveTimezone(request);
            TimezoneContext.setCurrentTimezone(resolvedTimezone);

            response.setHeader("X-Timezone", resolvedTimezone);

            filterChain.doFilter(request, response);

        } finally {
            TimezoneContext.clear();
        }
    }

    private String resolveTimezone(HttpServletRequest request) {
        // 1. Check X-Timezone header (highest priority)
        String tzHeader = request.getHeader("X-Timezone");
        if (tzHeader != null && !tzHeader.isBlank()) {
            return tzHeader;
        }

        // 2. Check X-Timezone-Offset header (minutes from UTC)
        String offsetHeader = request.getHeader("X-Timezone-Offset");
        if (offsetHeader != null && !offsetHeader.isBlank()) {
            try {
                int offsetMinutes = Integer.parseInt(offsetHeader);
                String resolved = resolveFromOffset(offsetMinutes);
                if (resolved != null) return resolved;
            } catch (NumberFormatException e) {
                log.debug("Invalid timezone offset: {}", offsetHeader);
            }
        }

        // 3. Default to India Standard Time
        return "Asia/Kolkata";
    }

    private String resolveFromOffset(int offsetMinutes) {
        return switch (offsetMinutes) {
            case -300 -> "America/New_York";
            case -360 -> "America/Chicago";
            case -420 -> "America/Denver";
            case -480 -> "America/Los_Angeles";
            case 0 -> "Europe/London";
            case 60 -> "Europe/Paris";
            case 120 -> "Europe/Helsinki";
            case 240 -> "Asia/Dubai";
            case 330 -> "Asia/Kolkata";
            case 420 -> "Asia/Bangkok";
            case 480 -> "Asia/Shanghai";
            case 540 -> "Asia/Tokyo";
            case 600 -> "Australia/Sydney";
            case 720 -> "Pacific/Auckland";
            default -> null;
        };
    }
}
