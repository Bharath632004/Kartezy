package com.kartezy.crm.constants;

public enum SegmentCriteria {
    // Behavioral
    TOTAL_ORDERS,
    TOTAL_SPENT,
    AVG_ORDER_VALUE,
    LAST_ORDER_DAYS,
    ORDER_FREQUENCY,
    FAVORITE_CATEGORY,
    FAVORITE_MERCHANT,

    // Demographic
    AGE_RANGE,
    CITY,
    STATE,
    PINCODE,
    GENDER,

    // Engagement
    EMAIL_OPT_IN,
    SMS_OPT_IN,
    WHATSAPP_OPT_IN,
    PUSH_OPT_IN,
    APP_LAST_SEEN_DAYS,
    EMAIL_CLICK_RATE,
    SMS_REPLY_RATE,

    // Loyalty
    LOYALTY_TIER,
    LOYALTY_POINTS,
    REFERRAL_COUNT,

    // Financial
    LIFETIME_VALUE,
    CREDIT_SCORE
}
