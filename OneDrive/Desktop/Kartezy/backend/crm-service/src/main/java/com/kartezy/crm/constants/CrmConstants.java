package com.kartezy.crm.constants;

public final class CrmConstants {
    private CrmConstants() {}

    // Campaign statuses
    public static final String CAMPAIGN_DRAFT = "DRAFT";
    public static final String CAMPAIGN_SCHEDULED = "SCHEDULED";
    public static final String CAMPAIGN_RUNNING = "RUNNING";
    public static final String CAMPAIGN_PAUSED = "PAUSED";
    public static final String CAMPAIGN_COMPLETED = "COMPLETED";
    public static final String CAMPAIGN_CANCELLED = "CANCELLED";

    // Lead statuses
    public static final String LEAD_NEW = "NEW";
    public static final String LEAD_CONTACTED = "CONTACTED";
    public static final String LEAD_QUALIFIED = "QUALIFIED";
    public static final String LEAD_CONVERTED = "CONVERTED";
    public static final String LEAD_LOST = "LOST";

    // Loyalty
    public static final int DEFAULT_POINTS_EXPIRY_DAYS = 365;
    public static final int SIGNUP_BONUS_POINTS = 100;
    public static final int REFERRAL_BONUS_POINTS = 200;

    // Kafka topics
    public static final String TOPIC_CRM_EVENTS = "crm-events";
    public static final String TOPIC_CAMPAIGN_EVENTS = "campaign-events";
    public static final String TOPIC_NOTIFICATION_EVENTS = "notification-events";
    public static final String TOPIC_LOYALTY_EVENTS = "loyalty-events";
    public static final String TOPIC_AI_EVENTS = "ai-events";

    // Cache names
    public static final String CACHE_SEGMENTS = "segments";
    public static final String CACHE_CAMPAIGNS = "campaigns";
    public static final String CACHE_CUSTOMER_SEGMENTS = "customerSegments";
    public static final String CACHE_LOYALTY_TIERS = "loyaltyTiers";

    // Entity types for audit
    public static final String ENTITY_CUSTOMER = "CUSTOMER";
    public static final String ENTITY_MERCHANT = "MERCHANT";
    public static final String ENTITY_LEAD = "LEAD";
    public static final String ENTITY_REFERRAL = "REFERRAL";
    public static final String ENTITY_LOYALTY = "LOYALTY";
    public static final String ENTITY_CAMPAIGN = "CAMPAIGN";
    public static final String ENTITY_COUPON = "COUPON";
    public static final String ENTITY_SEGMENT = "SEGMENT";
    public static final String ENTITY_REWARD = "REWARD";
}
