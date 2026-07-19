package com.kartezy.shared.enterprise.geography;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Geographical routing service for multi-city, multi-state, multi-country operations.
 * Routes requests to the appropriate regional service instance and handles
 * geo-aware load balancing.
 */
@Slf4j
@Service
public class GeoRoutingService {

    private final Map<String, RegionRoute> regionRoutes = new ConcurrentHashMap<>();

    /**
     * Route a request to the appropriate region based on geographic coordinates.
     */
    public RegionRoute resolveRegion(double latitude, double longitude) {
        // Nearest region based on geo-coordinates
        return regionRoutes.values().stream()
                .min(Comparator.comparingDouble(r ->
                        haversineDistance(latitude, longitude,
                                r.latitude(), r.longitude())))
                .orElseThrow(() -> new IllegalStateException("No region available"));
    }

    /**
     * Resolve the region for a given city code.
     */
    public RegionRoute resolveRegionByCity(String cityCode) {
        RegionRoute route = regionRoutes.get(cityCode);
        if (route == null) {
            throw new IllegalArgumentException("No region configured for city: " + cityCode);
        }
        return route;
    }

    /**
     * Get all active regions.
     */
    public Collection<RegionRoute> getAllRegions() {
        return Collections.unmodifiableCollection(regionRoutes.values());
    }

    /**
     * Register a new region route.
     */
    public void registerRegion(RegionRoute route) {
        regionRoutes.put(route.cityCode(), route);
        log.info("Registered region route for city: {} ({}, {})",
                route.cityName(), route.countryCode(), route.cityCode());
    }

    /**
     * Remove a region route.
     */
    public void deregisterRegion(String cityCode) {
        regionRoutes.remove(cityCode);
        log.info("Deregistered region route for city: {}", cityCode);
    }

    /**
     * Haversine distance calculation between two points on Earth.
     */
    public static double haversineDistance(double lat1, double lon1,
                                            double lat2, double lon2) {
        final double R = 6371; // Earth's radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Represents a regional service route with connection details.
     */
    public record RegionRoute(
            String cityCode,
            String cityName,
            String stateCode,
            String countryCode,
            double latitude,
            double longitude,
            String serviceUrl,
            String databaseShard,
            boolean isPrimary,
            int priority
    ) {}
}
