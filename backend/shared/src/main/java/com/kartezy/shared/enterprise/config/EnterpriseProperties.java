package com.kartezy.shared.enterprise.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for enterprise scalability features.
 * Set via application.properties or application.yml.
 */
@Data
@Component
@ConfigurationProperties(prefix = "kartezy.enterprise")
public class EnterpriseProperties {

    private MultiTenant multiTenant = new MultiTenant();
    private I18n i18n = new I18n();
    private Currency currency = new Currency();
    private Timezone timezone = new Timezone();
    private Geography geography = new Geography();
    private Franchise franchise = new Franchise();
    private Marketplace marketplace = new Marketplace();
    private Warehouse warehouse = new Warehouse();
    private WhiteLabel whiteLabel = new WhiteLabel();
    private HorizonatalScaling horizontalScaling = new HorizonatalScaling();
    private DisasterRecovery disasterRecovery = new DisasterRecovery();
    private GeoReplication geoReplication = new GeoReplication();

    @Data
    public static class MultiTenant {
        private boolean enabled = true;
        private String schemaStrategy = "schema_per_tenant"; // schema_per_tenant, database_per_tenant
        private boolean cacheEnabled = true;
        private int cacheTtlSeconds = 300;
    }

    @Data
    public static class I18n {
        private boolean enabled = true;
        private String defaultLanguage = "en";
        private String fallbackLanguage = "en";
        private String bundleBaseName = "messages";
        private boolean cacheMessages = true;
    }

    @Data
    public static class Currency {
        private boolean enabled = true;
        private String defaultCurrency = "INR";
        private String[] supportedCurrencies = {"INR", "USD", "EUR", "GBP", "JPY", "AED"};
        private int rateUpdateIntervalMinutes = 60;
    }

    @Data
    public static class Timezone {
        private boolean enabled = true;
        private String defaultTimezone = "Asia/Kolkata";
    }

    @Data
    public static class Geography {
        private boolean enabled = true;
        private String[] supportedCountries = {"IN", "US", "AE", "SG", "MY"};
        private int maxCityRadiusKm = 25;
    }

    @Data
    public static class Franchise {
        private boolean enabled = false;
        private boolean autoApprove = false;
        private int onboardingTimeoutDays = 30;
    }

    @Data
    public static class Marketplace {
        private boolean enabled = true;
        private boolean multiVendorCart = true;
        private int maxVendorsPerOrder = 5;
        private String defaultCommissionModel = "PERCENTAGE";
        private String[] supportedPayoutModes = {"DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY"};
    }

    @Data
    public static class Warehouse {
        private boolean enabled = true;
        private boolean autoReplenish = false;
        private int lowStockThreshold = 10;
        private int maxTransferDistanceKm = 200;
    }

    @Data
    public static class WhiteLabel {
        private boolean enabled = false;
        private boolean allowCustomDomain = true;
        private boolean allowCustomCss = true;
    }

    @Data
    public static class HorizonatalScaling {
        private boolean enabled = true;
        private int minReplicas = 2;
        private int maxReplicas = 10;
        private double cpuThreshold = 0.7;
        private double memoryThreshold = 0.8;
    }

    @Data
    public static class DisasterRecovery {
        private boolean enabled = true;
        private String backupSchedule = "0 */6 * * *"; // Every 6 hours
        private int backupRetentionDays = 30;
        private int rpoMinutes = 60;
        private int rtoMinutes = 240;
    }

    @Data
    public static class GeoReplication {
        private boolean enabled = false;
        private String[] regions = {"ap-south-1", "us-east-1", "eu-west-1"};
        private boolean activePassive = true;
        private boolean crossRegionFailover = true;
    }
}
