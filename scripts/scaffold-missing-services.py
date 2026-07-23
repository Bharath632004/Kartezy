#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Scaffold all 21 missing backend microservices for Kartezy Enterprise."""

import os
import sys

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = r"C:\Users\chaka\Kartezy\backend"

SERVICES = [
    ("pricing-service", "PricingService", "pricingservice", 8085, "pricing", "dynamic pricing rules and strategies"),
    ("promotion-service", "PromotionService", "promotionservice", 8086, "promotion", "promotions, offers, and discount campaigns"),
    ("wishlist-service", "WishlistService", "wishlistservice", 8087, "wishlist", "customer wishlist management"),
    ("checkout-service", "CheckoutService", "checkoutservice", 8088, "checkout", "checkout workflow orchestration"),
    ("invoice-service", "InvoiceService", "invoiceservice", 8089, "invoice", "invoice generation and management"),
    ("tracking-service", "TrackingService", "trackingservice", 8090, "tracking", "real-time order and delivery tracking via WebSocket"),
    ("review-service", "ReviewService", "reviewservice", 8091, "review", "product reviews and ratings"),
    ("recommendation-service", "RecommendationService", "recommendationservice", 8092, "recommendation", "AI-powered product recommendations"),
    ("analytics-service", "AnalyticsService", "analyticsservice", 8093, "analytics", "business analytics and metrics aggregation"),
    ("finance-service", "FinanceService", "financeservice", 8094, "finance", "financial operations and accounting"),
    ("settlement-service", "SettlementService", "settlementservice", 8095, "settlement", "merchant and partner settlements"),
    ("support-service", "SupportService", "supportservice", 8096, "support", "customer support ticket management"),
    ("cms-service", "CmsService", "cmsservice", 8097, "cms", "content management for banners and pages"),
    ("admin-service", "AdminService", "adminservice", 8098, "admin", "admin panel backend services"),
    ("membership-service", "MembershipService", "membershipservice", 8099, "membership", "membership program management"),
    ("subscription-service", "SubscriptionService", "subscriptionservice", 8100, "subscription", "subscription plans and recurring orders"),
    ("loyalty-service", "LoyaltyService", "loyaltyservice", 8101, "loyalty", "loyalty points and rewards"),
    ("fraud-service", "FraudService", "fraudservice", 8102, "fraud", "fraud detection and prevention"),
    ("report-service", "ReportService", "reportservice", 8103, "report", "report generation and export"),
    ("audit-service", "AuditService", "auditservice", 8104, "audit", "audit logging and compliance"),
    ("scheduler-service", "SchedulerService", "schedulerservice", 8105, "scheduler", "distributed task scheduling"),
]


def scaffold_service(service_id, display_class, pkg, port, db_name, description):
    """Create full scaffolding for a single microservice."""
    srv_dir = os.path.join(BASE_DIR, service_id)
    src_dir = os.path.join(srv_dir, "src", "main", "java", "com", "kartezy", pkg)
    res_dir = os.path.join(srv_dir, "src", "main", "resources")
    test_dir = os.path.join(srv_dir, "src", "test", "java", "com", "kartezy", pkg)

    # Create directories
    os.makedirs(os.path.join(src_dir, "controller"), exist_ok=True)
    os.makedirs(os.path.join(src_dir, "config"), exist_ok=True)
    os.makedirs(os.path.join(src_dir, "service"), exist_ok=True)
    os.makedirs(os.path.join(src_dir, "repository"), exist_ok=True)
    os.makedirs(os.path.join(src_dir, "dto"), exist_ok=True)
    os.makedirs(os.path.join(src_dir, "entity"), exist_ok=True)
    os.makedirs(res_dir, exist_ok=True)
    os.makedirs(test_dir, exist_ok=True)

    # Write pom.xml
    with open(os.path.join(srv_dir, "pom.xml"), "w", encoding='utf-8') as f:
        f.write(f'''<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.kartezy</groupId>
        <artifactId>kartezy-backend</artifactId>
        <version>0.0.1-SNAPSHOT</version>
        <relativePath>../pom.xml</relativePath>
    </parent>
    <artifactId>{service_id}</artifactId>
    <name>{service_id}</name>
    <description>{service_id} service for Kartezy</description>
    <properties>
        <java.version>21</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-bootstrap</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        </dependency>
        <dependency>
            <groupId>com.kartezy</groupId>
            <artifactId>shared</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-core</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-junit-jupiter</artifactId>
            <version>5.12.0</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>''')

    # Write Application.java
    with open(os.path.join(src_dir, f"{display_class}Application.java"), "w", encoding='utf-8') as f:
        f.write(f'''package com.kartezy.{pkg};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class {display_class}Application {{

    public static void main(String[] args) {{
        SpringApplication.run({display_class}Application.class, args);
    }}
}}''')

    # Write HealthController.java
    with open(os.path.join(src_dir, "controller", "HealthController.java"), "w", encoding='utf-8') as f:
        f.write(f'''package com.kartezy.{pkg}.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {{

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {{
        return ResponseEntity.ok(Map.of(
            "service", "{service_id}",
            "status", "UP",
            "timestamp", Instant.now().toString()
        ));
    }}
}}''')

    # Write SecurityConfig.java
    with open(os.path.join(src_dir, "config", "SecurityConfig.java"), "w", encoding='utf-8') as f:
        f.write(f'''package com.kartezy.{pkg}.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {{

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {{
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health", "/actuator/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {{}}));
        return http.build();
    }}
}}''')

    # Write application.yml
    with open(os.path.join(res_dir, "application.yml"), "w", encoding='utf-8') as f:
        f.write(f'''server:
  port: {port}

spring:
  application:
    name: {service_id}
  datasource:
    url: ${{DB_URL:jdbc:postgresql://postgres:5432/kartezy_{db_name}}}
    driver-class-name: org.postgresql.Driver
    username: ${{DB_USERNAME:kartezy}}
    password: ${{DB_PASSWORD:kartezy}}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  config:
    import: configserver:http://config-server:8888
  cloud:
    config:
      uri: http://config-server:8888
      fail-fast: true
      retry:
        initial-interval: 1000
        max-interval: 2000
        multiplier: 1.1
        max-attempts: 6
    discovery:
      enabled: true
      service-id: config-server

eureka:
  client:
    service-url:
      defaultZone: http://discovery-server:8761/eureka/
    fetch-registry: true
    register-with-eureka: true

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always

jwt:
  secret: ${{JWT_SECRET}}
  expiration: ${{JWT_EXPIRATION:86400000}}
  refresh-token:
    expiration: ${{JWT_REFRESH_TOKEN_EXPIRATION:604800000}}

security:
  oauth2:
    resourceserver:
      jwt:
        issuer-uri: ${{JWT_ISSUER_URI:http://auth-service:8081}}
        jwk-set-uri: ${{JWK_SET_URI:http://auth-service:8081/oauth2/jwks}}
''')

    # Write bootstrap.yml
    with open(os.path.join(res_dir, "bootstrap.yml"), "w", encoding='utf-8') as f:
        f.write(f'''spring:
  application:
    name: {service_id}
  cloud:
    config:
      uri: http://config-server:8888
      fail-fast: true
''')

    # Write Dockerfile
    with open(os.path.join(srv_dir, "Dockerfile"), "w", encoding='utf-8') as f:
        f.write(f'''FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE {port}

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \\\\
  CMD wget -qO- http://localhost:{port}/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
''')

    # Write README.md
    with open(os.path.join(srv_dir, "README.md"), "w", encoding='utf-8') as f:
        f.write(f'''# {display_class}

## Overview
The {service_id} is a microservice in the Kartezy platform that handles {description}.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: {port}
- Database: kartezy_{db_name}
- Dependencies: Config Server, Discovery Server, Auth Service

## Building
```bash
mvn clean package -DskipTests
```

## Running
```bash
mvn spring-boot:run
```

## Testing
```bash
mvn test
```
''')


def main():
    n = len(SERVICES)
    for i, (service_id, display_class, pkg, port, db_name, description) in enumerate(SERVICES, 1):
        scaffold_service(service_id, display_class, pkg, port, db_name, description)
        print(f"Created ({i}/{n}): {service_id} (port {port})", flush=True)

    print()
    print("DONE - All 21 backend services scaffolded successfully!")


if __name__ == "__main__":
    main()
