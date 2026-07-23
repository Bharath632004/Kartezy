#!/bin/bash
# ============================================================
# Scaffold missing backend services for Kartezy Enterprise
# ============================================================
set -e

SERVICES=(
  "pricing-service:PricingService:pricingservice"
  "promotion-service:PromotionService:promotionservice"
  "wishlist-service:WishlistService:wishlistservice"
  "checkout-service:CheckoutService:checkoutservice"
  "invoice-service:InvoiceService:invoiceservice"
  "tracking-service:TrackingService:trackingservice"
  "review-service:ReviewService:reviewservice"
  "recommendation-service:RecommendationService:recommendationservice"
  "analytics-service:AnalyticsService:analyticsservice"
  "finance-service:FinanceService:financeservice"
  "settlement-service:SettlementService:settlementservice"
  "support-service:SupportService:supportservice"
  "cms-service:CmsService:cmsservice"
  "admin-service:AdminService:adminservice"
  "membership-service:MembershipService:membershipservice"
  "subscription-service:SubscriptionService:subscriptionservice"
  "loyalty-service:LoyaltyService:loyaltyservice"
  "fraud-service:FraudService:fraudservice"
  "report-service:ReportService:reportservice"
  "audit-service:AuditService:auditservice"
  "scheduler-service:SchedulerService:schedulerservice"
)

BASE_DIR="C:/Users/chaka/Kartezy/backend"

# Shared pom.xml template
POM_TEMPLATE='<?xml version="1.0" encoding="UTF-8"?>
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
    <artifactId>${SERVICE_ID}</artifactId>
    <name>${SERVICE_ID}</name>
    <description>${SERVICE_ID} service for Kartezy</description>
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
            <version>${springdoc.version}</version>
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
</project>'

# Application.java template
APP_TEMPLATE='package com.kartezy.${PKG};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ${CLASS}Application {

    public static void main(String[] args) {
        SpringApplication.run(${CLASS}Application.class, args);
    }
}'

# HealthController template
HEALTH_TEMPLATE='package com.kartezy.${PKG}.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "service", "${SERVICE_ID}",
            "status", "UP",
            "timestamp", Instant.now().toString()
        ));
    }
}'

# SecurityConfig template
SECURITY_TEMPLATE='package com.kartezy.${PKG}.config;

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
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health", "/actuator/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}));
        return http.build();
    }
}'

# application.yml template
YML_TEMPLATE='server:
  port: ${PORT}

spring:
  application:
    name: ${SERVICE_ID}
  datasource:
    url: ${DB_URL:jdbc:postgresql://postgres:5432/kartezy_${DB_NAME}}
    driver-class-name: org.postgresql.Driver
    username: ${DB_USERNAME:kartezy}
    password: ${DB_PASSWORD:kartezy}
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
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:86400000}
  refresh-token:
    expiration: ${JWT_REFRESH_TOKEN_EXPIRATION:604800000}

security:
  oauth2:
    resourceserver:
      jwt:
        issuer-uri: ${JWT_ISSUER_URI:http://auth-service:8081}
        jwk-set-uri: ${JWK_SET_URI:http://auth-service:8081/oauth2/jwks}'

# Dockerfile template
DOCKER_TEMPLATE='FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:${PORT}/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]'

# README template
README_TEMPLATE='# ${TITLE}

## Overview
The ${SERVICE_ID} is a microservice in the Kartezy platform that handles ${DESCRIPTION}.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: ${PORT}
- Database: kartezy_${DB_NAME}
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
```'

# Port assignments for each service (8085-8120 range after existing 8082-8084)
declare -A PORTS
PORTS=(
  ["pricing-service"]="8085"
  ["promotion-service"]="8086"
  ["wishlist-service"]="8087"
  ["checkout-service"]="8088"
  ["invoice-service"]="8089"
  ["tracking-service"]="8090"
  ["review-service"]="8091"
  ["recommendation-service"]="8092"
  ["analytics-service"]="8093"
  ["finance-service"]="8094"
  ["settlement-service"]="8095"
  ["support-service"]="8096"
  ["cms-service"]="8097"
  ["admin-service"]="8098"
  ["membership-service"]="8099"
  ["subscription-service"]="8100"
  ["loyalty-service"]="8101"
  ["fraud-service"]="8102"
  ["report-service"]="8103"
  ["audit-service"]="8104"
  ["scheduler-service"]="8105"
)

# Database name mapping
declare -A DB_NAMES
DB_NAMES=(
  ["pricing-service"]="pricing"
  ["promotion-service"]="promotion"
  ["wishlist-service"]="wishlist"
  ["checkout-service"]="checkout"
  ["invoice-service"]="invoice"
  ["tracking-service"]="tracking"
  ["review-service"]="review"
  ["recommendation-service"]="recommendation"
  ["analytics-service"]="analytics"
  ["finance-service"]="finance"
  ["settlement-service"]="settlement"
  ["support-service"]="support"
  ["cms-service"]="cms"
  ["admin-service"]="admin"
  ["membership-service"]="membership"
  ["subscription-service"]="subscription"
  ["loyalty-service"]="loyalty"
  ["fraud-service"]="fraud"
  ["report-service"]="report"
  ["audit-service"]="audit"
  ["scheduler-service"]="scheduler"
)

# Descriptions
declare -A DESCS
DESCS=(
  ["pricing-service"]="dynamic pricing rules and strategies"
  ["promotion-service"]="promotions, offers, and discount campaigns"
  ["wishlist-service"]="customer wishlist management"
  ["checkout-service"]="checkout workflow orchestration"
  ["invoice-service"]="invoice generation and management"
  ["tracking-service"]="real-time order and delivery tracking via WebSocket"
  ["review-service"]="product reviews and ratings"
  ["recommendation-service"]="AI-powered product recommendations"
  ["analytics-service"]="business analytics and metrics aggregation"
  ["finance-service"]="financial operations and accounting"
  ["settlement-service"]="merchant and partner settlements"
  ["support-service"]="customer support ticket management"
  ["cms-service"]="content management for banners and pages"
  ["admin-service"]="admin panel backend services"
  ["membership-service"]="membership program management"
  ["subscription-service"]="subscription plans and recurring orders"
  ["loyalty-service"]="loyalty points and rewards"
  ["fraud-service"]="fraud detection and prevention"
  ["report-service"]="report generation and export"
  ["audit-service"]="audit logging and compliance"
  ["scheduler-service"]="distributed task scheduling"
)

# Process each service
for SERVICE_INFO in "${SERVICES[@]}"; do
  IFS=':' read -r SERVICE_ID DISPLAY_NAME PKG <<< "$SERVICE_INFO"
  
  PORT="${PORTS[$SERVICE_ID]}"
  DB_NAME="${DB_NAMES[$SERVICE_ID]}"
  DESC="${DESCS[$SERVICE_ID]}"
  TITLE="$DISPLAY_NAME"
  CLASS="${DISPLAY_NAME}"
  
  echo "Creating scaffolding for $SERVICE_ID ..."
  
  SERVICE_DIR="$BASE_DIR/$SERVICE_ID"
  SRC_DIR="$SERVICE_DIR/src/main/java/com/kartezy/$PKG"
  RES_DIR="$SERVICE_DIR/src/main/resources"
  TEST_DIR="$SERVICE_DIR/src/test/java/com/kartezy/$PKG"
  
  # Create directory structure
  mkdir -p "$SRC_DIR/controller"
  mkdir -p "$SRC_DIR/config"
  mkdir -p "$SRC_DIR/service"
  mkdir -p "$SRC_DIR/repository"
  mkdir -p "$SRC_DIR/dto"
  mkdir -p "$SRC_DIR/entity"
  mkdir -p "$RES_DIR"
  mkdir -p "$TEST_DIR"
  
  # Write pom.xml
  eval "echo \"$POM_TEMPLATE\"" > "$SERVICE_DIR/pom.xml"
  
  # Write Application.java
  APP_CONTENT=$(cat <<EOF
package com.kartezy.${PKG};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ${CLASS}Application {

    public static void main(String[] args) {
        SpringApplication.run(${CLASS}Application.class, args);
    }
}
EOF
)
  echo "$APP_CONTENT" > "$SRC_DIR/${CLASS}Application.java"
  
  # Write HealthController.java
  HEALTH_CONTENT=$(cat <<EOF
package com.kartezy.${PKG}.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "service", "${SERVICE_ID}",
            "status", "UP",
            "timestamp", Instant.now().toString()
        ));
    }
}
EOF
)
  echo "$HEALTH_CONTENT" > "$SRC_DIR/controller/HealthController.java"
  
  # Write SecurityConfig.java
  SEC_CONTENT=$(cat <<EOF
package com.kartezy.${PKG}.config;

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
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health", "/actuator/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}));
        return http.build();
    }
}
EOF
)
  echo "$SEC_CONTENT" > "$SRC_DIR/config/SecurityConfig.java"
  
  # Write application.yml
  YML_CONTENT=$(cat <<EOF
server:
  port: ${PORT}

spring:
  application:
    name: ${SERVICE_ID}
  datasource:
    url: \${DB_URL:jdbc:postgresql://postgres:5432/kartezy_${DB_NAME}}
    driver-class-name: org.postgresql.Driver
    username: \${DB_USERNAME:kartezy}
    password: \${DB_PASSWORD:kartezy}
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
  secret: \${JWT_SECRET}
  expiration: \${JWT_EXPIRATION:86400000}
  refresh-token:
    expiration: \${JWT_REFRESH_TOKEN_EXPIRATION:604800000}

security:
  oauth2:
    resourceserver:
      jwt:
        issuer-uri: \${JWT_ISSUER_URI:http://auth-service:8081}
        jwk-set-uri: \${JWK_SET_URI:http://auth-service:8081/oauth2/jwks}
EOF
)
  echo "$YML_CONTENT" > "$RES_DIR/application.yml"
  
  # Write bootstrap.yml
  BOOTSTRAP_CONTENT=$(cat <<EOF
spring:
  application:
    name: ${SERVICE_ID}
  cloud:
    config:
      uri: http://config-server:8888
      fail-fast: true
EOF
)
  echo "$BOOTSTRAP_CONTENT" > "$RES_DIR/bootstrap.yml"
  
  # Write Dockerfile
  DOCKER_CONTENT=$(cat <<EOF
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \\
  CMD wget -qO- http://localhost:${PORT}/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
EOF
)
  echo "$DOCKER_CONTENT" > "$SERVICE_DIR/Dockerfile"
  
  # Write README.md
  README_CONTENT=$(cat <<EOF
# ${CLASS}

## Overview
The ${SERVICE_ID} is a microservice in the Kartezy platform that handles ${DESC}.

## API Endpoints
- \`GET /health\` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: ${PORT}
- Database: kartezy_${DB_NAME}
- Dependencies: Config Server, Discovery Server, Auth Service

## Building
\`\`\`bash
mvn clean package -DskipTests
\`\`\`

## Running
\`\`\`bash
mvn spring-boot:run
\`\`\`

## Testing
\`\`\`bash
mvn test
\`\`\`
EOF
)
  echo "$README_CONTENT" > "$SERVICE_DIR/README.md"
  
  echo "  ✅ Created $SERVICE_ID (port $PORT)"
done

echo ""
echo "============================================================"
echo "All 21 missing backend services have been scaffolded!"
echo "============================================================"
echo ""
echo "Services created:"
for SERVICE_INFO in "${SERVICES[@]}"; do
  IFS=':' read -r SERVICE_ID DISPLAY_NAME PKG <<< "$SERVICE_INFO"
  echo "  - $SERVICE_ID (port ${PORTS[$SERVICE_ID]})"
done
echo ""
echo "Next steps:"
echo "  1. Update backend/pom.xml to include all new modules"
echo "  2. Add services to docker-compose.yml"
echo "  3. Add services to Kubernetes manifests"
echo "  4. Implement business logic for each service"
