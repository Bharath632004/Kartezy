package com.kartezy.ops.constants;

import java.math.BigDecimal;

public final class OpsConstants {
    private OpsConstants() {}

    // Service / City statuses
    public static final String CITY_ACTIVE = "ACTIVE";
    public static final String CITY_INACTIVE = "INACTIVE";
    public static final String CITY_LAUNCHING = "LAUNCHING";

    // Zone types
    public static final String ZONE_PRIMARY = "PRIMARY";
    public static final String ZONE_EXPANDED = "EXPANDED";
    public static final String ZONE_PREMIUM = "PREMIUM";

    // Warehouse statuses
    public static final String WH_ACTIVE = "ACTIVE";
    public static final String WH_MAINTENANCE = "MAINTENANCE";
    public static final String WH_INACTIVE = "INACTIVE";

    // Merchant verification statuses
    public static final String MERCHANT_PENDING = "PENDING_VERIFICATION";
    public static final String MERCHANT_VERIFIED = "VERIFIED";
    public static final String MERCHANT_SUSPENDED = "SUSPENDED";
    public static final String MERCHANT_REJECTED = "REJECTED";

    // Inventory ops statuses
    public static final String INV_HEALTHY = "HEALTHY";
    public static final String INV_LOW = "LOW_STOCK";
    public static final String INV_OUT = "OUT_OF_STOCK";
    public static final String INV_OVERFLOW = "OVERFLOW";

    // Support ticket priorities
    public static final String PRIORITY_LOW = "LOW";
    public static final String PRIORITY_MEDIUM = "MEDIUM";
    public static final String PRIORITY_HIGH = "HIGH";
    public static final String PRIORITY_CRITICAL = "CRITICAL";

    // Support ticket statuses
    public static final String TICKET_OPEN = "OPEN";
    public static final String TICKET_IN_PROGRESS = "IN_PROGRESS";
    public static final String TICKET_RESOLVED = "RESOLVED";
    public static final String TICKET_CLOSED = "CLOSED";

    // Incident severity
    public static final String SEV_CRITICAL = "CRITICAL";
    public static final String SEV_MAJOR = "MAJOR";
    public static final String SEV_MINOR = "MINOR";
    public static final String SEV_TRIVIAL = "TRIVIAL";

    // Incident statuses
    public static final String INCIDENT_NEW = "NEW";
    public static final String INCIDENT_INVESTIGATING = "INVESTIGATING";
    public static final String INCIDENT_MITIGATED = "MITIGATED";
    public static final String INCIDENT_RESOLVED = "RESOLVED";

    // Escalation levels
    public static final String ESC_L1 = "L1_SUPPORT";
    public static final String ESC_L2 = "L2_SUPPORT";
    public static final String ESC_L3 = "L3_SUPPORT";
    public static final String ESC_MANAGEMENT = "MANAGEMENT";

    // SLA statuses
    public static final String SLA_MET = "MET";
    public static final String SLA_BREACHED = "BREACHED";
    public static final String SLA_AT_RISK = "AT_RISK";

    // Business rule types
    public static final String RULE_COMMISSION = "COMMISSION";
    public static final String RULE_SLA = "SLA";
    public static final String RULE_PRICING = "PRICING";
    public static final String RULE_VERIFICATION = "VERIFICATION";
    public static final String RULE_ALLOCATION = "ALLOCATION";

    // Delivery statuses
    public static final String DELIVERY_PENDING = "PENDING";
    public static final String DELIVERY_ASSIGNED = "ASSIGNED";
    public static final String DELIVERY_PICKED_UP = "PICKED_UP";
    public static final String DELIVERY_IN_TRANSIT = "IN_TRANSIT";
    public static final String DELIVERY_DELIVERED = "DELIVERED";
    public static final String DELIVERY_FAILED = "FAILED";

    // Kafka topics
    public static final String TOPIC_OPS_EVENTS = "ops-events";
    public static final String TOPIC_SLA_EVENTS = "sla-events";
    public static final String TOPIC_INCIDENT_EVENTS = "incident-events";
    public static final String TOPIC_ESCALATION_EVENTS = "escalation-events";
    public static final String TOPIC_INVENTORY_EVENTS = "inventory-events";

    // SLA thresholds (in minutes)
    public static final int SLA_TICKET_FIRST_RESPONSE = 30;
    public static final int SLA_TICKET_RESOLUTION_LOW = 2880;     // 48 hours
    public static final int SLA_TICKET_RESOLUTION_MEDIUM = 1440;  // 24 hours
    public static final int SLA_TICKET_RESOLUTION_HIGH = 480;     // 8 hours
    public static final int SLA_TICKET_RESOLUTION_CRITICAL = 120; // 2 hours
    public static final int SLA_INCIDENT_RESPONSE = 15;           // 15 min
    public static final int SLA_DELIVERY_PICKUP = 30;             // 30 min
    public static final int SLA_DELIVERY_TRANSIT = 240;           // 4 hours

    // Default business rule values
    public static final BigDecimal DEFAULT_MIN_COMMISSION = new BigDecimal("0.10");
    public static final BigDecimal DEFAULT_MAX_COMMISSION = new BigDecimal("0.30");
    public static final BigDecimal DEFAULT_COMMISSION_RATE = new BigDecimal("0.15");

    // Cache names
    public static final String CACHE_CITIES = "cities";
    public static final String CACHE_ZONES = "zones";
    public static final String CACHE_RULES = "rules";
    public static final String CACHE_SLA = "sla";
    public static final String CACHE_DASHBOARD = "dashboard";
}
