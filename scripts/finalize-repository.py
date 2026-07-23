#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Finalize Kartezy Enterprise Repository:
1. Fix port conflicts between new scaffolding and existing docker-compose
2. Add skeleton tests to all 21 new backend services
3. Add skeleton tests to existing services without tests
"""

import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE = r"C:\Users\chaka\Kartezy"
BACKEND = os.path.join(BASE, "backend")

# Corrected port assignments (avoiding conflicts with existing docker-compose ports)
# Existing in use: 8081(auth), 8082(user), 8083(merchant), 8084(catalog),
#                   8085(inventory), 8086(order), 8087(cart),
#                   8090(wallet), 8091(delivery), 8092(payment),
#                   8093(notification), 8102(search)
# Available: 8088, 8089, 8094-8101, 8103-8113

PORT_MAP = {
    "pricing-service": 8088,
    "promotion-service": 8089,
    "wishlist-service": 8094,
    "checkout-service": 8095,
    "invoice-service": 8096,
    "tracking-service": 8097,
    "review-service": 8098,
    "recommendation-service": 8099,
    "analytics-service": 8100,
    "finance-service": 8101,
    "settlement-service": 8103,
    "support-service": 8104,
    "cms-service": 8105,
    "admin-service": 8106,
    "membership-service": 8107,
    "subscription-service": 8108,
    "loyalty-service": 8109,
    "fraud-service": 8110,
    "report-service": 8111,
    "audit-service": 8112,
    "scheduler-service": 8113,
}


def fix_port_in_application_yml(service_id, new_port):
    """Fix the port in application.yml for a service."""
    yml_path = os.path.join(BACKEND, service_id, "src", "main", "resources", "application.yml")
    if not os.path.exists(yml_path):
        print(f"  WARN: {yml_path} not found")
        return
    with open(yml_path, "r", encoding="utf-8") as f:
        content = f.read()
    # Replace "port: <old>" with the new port
    import re
    content = re.sub(r'^server:\n  port: \d+', f'server:\n  port: {new_port}', content, count=1, flags=re.MULTILINE)
    with open(yml_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Fixed port: {service_id} -> {new_port}")


def add_skeleton_test(service_id, display_class, pkg, port):
    """Add a skeleton context-loading test to a service."""
    test_file = os.path.join(
        BACKEND, service_id,
        "src", "test", "java", "com", "kartezy", pkg,
        f"{display_class}ApplicationTest.java"
    )

    # Skip if test already exists in this service
    test_dir = os.path.join(BACKEND, service_id, "src", "test")
    if os.path.exists(test_dir) and os.path.isdir(test_dir):
        existing_tests = []
        for root, dirs, files in os.walk(test_dir):
            for f in files:
                if f.endswith(".java"):
                    existing_tests.append(f)
        if existing_tests:
            print(f"  Already has tests: {service_id} ({', '.join(existing_tests)})")
            return

    os.makedirs(os.path.dirname(test_file), exist_ok=True)

    test_content = f'''package com.kartezy.{pkg};

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class {display_class}ApplicationTest {{

    @Test
    void contextLoads() {{
        // Verify application context loads successfully
    }}
}}'''
    with open(test_file, "w", encoding="utf-8") as f:
        f.write(test_content)
    print(f"  Added skeleton test: {service_id}")


def main():
    print("=" * 60)
    print("1. FIXING PORT CONFLICTS")
    print("=" * 60)
    for service_id, port in sorted(PORT_MAP.items()):
        fix_port_in_application_yml(service_id, port)

    print()
    print("=" * 60)
    print("2. ADDING SKELETON TESTS TO 21 NEW SERVICES")
    print("=" * 60)
    # Services info mapping
    services = [
        ("pricing-service", "PricingService", "pricingservice"),
        ("promotion-service", "PromotionService", "promotionservice"),
        ("wishlist-service", "WishlistService", "wishlistservice"),
        ("checkout-service", "CheckoutService", "checkoutservice"),
        ("invoice-service", "InvoiceService", "invoiceservice"),
        ("tracking-service", "TrackingService", "trackingservice"),
        ("review-service", "ReviewService", "reviewservice"),
        ("recommendation-service", "RecommendationService", "recommendationservice"),
        ("analytics-service", "AnalyticsService", "analyticsservice"),
        ("finance-service", "FinanceService", "financeservice"),
        ("settlement-service", "SettlementService", "settlementservice"),
        ("support-service", "SupportService", "supportservice"),
        ("cms-service", "CmsService", "cmsservice"),
        ("admin-service", "AdminService", "adminservice"),
        ("membership-service", "MembershipService", "membershipservice"),
        ("subscription-service", "SubscriptionService", "subscriptionservice"),
        ("loyalty-service", "LoyaltyService", "loyaltyservice"),
        ("fraud-service", "FraudService", "fraudservice"),
        ("report-service", "ReportService", "reportservice"),
        ("audit-service", "AuditService", "auditservice"),
        ("scheduler-service", "SchedulerService", "schedulerservice"),
    ]
    for service_id, display_class, pkg in services:
        port = PORT_MAP[service_id]
        add_skeleton_test(service_id, display_class, pkg, port)

    print()
    print("=" * 60)
    print("3. ADDING SKELETON TESTS TO EXISTING SERVICES WITHOUT TESTS")
    print("=" * 60)
    # Services that already have tests (skip these)
    services_with_tests = {"auth-service", "payment-service", "order-service"}
    existing_services = [
        ("user-service", "UserService", "userservice"),
        ("merchant-service", "MerchantService", "merchantservice"),
        ("catalog-service", "CatalogService", "catalogservice"),
        ("inventory-service", "InventoryService", "inventoryservice"),
        ("cart-service", "CartService", "cartsService"),
        ("delivery-service", "DeliveryService", "deliveryservice"),
        ("notification-service", "NotificationService", "notificationservice"),
        ("wallet-service", "WalletService", "walletservice"),
        ("search-service", "SearchService", "searchservice"),
    ]
    # Also config-server, discovery-server, api-gateway
    infra_services = [
        ("config-server", "ConfigServer", "configserver"),
        ("discovery-server", "DiscoveryServer", "discoveryserver"),
        ("api-gateway", "ApiGateway", "apigateway"),
    ]
    for service_id, display_class, pkg in existing_services + infra_services:
        if service_id in services_with_tests:
            print(f"  Skipped (has tests): {service_id}")
            continue
        add_skeleton_test(service_id, display_class, pkg, 0)

    print()
    print("DONE - All fixes applied!")


if __name__ == "__main__":
    main()
