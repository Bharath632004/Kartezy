#!/usr/bin/env python3
"""Update docker-compose.yml with all 21 new backend services."""

SERVICES_CONFIG = r"""  # =====================
  # Enterprise Microservices (Scaffolded)
  # =====================

  pricing-service:
    build:
      context: ../..
      dockerfile: ./backend/pricing-service/Dockerfile
    ports:
      - "${PRICING_SERVICE_PORT:-8088}:8088"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: pricing-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8088/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  promotion-service:
    build:
      context: ../..
      dockerfile: ./backend/promotion-service/Dockerfile
    ports:
      - "${PROMOTION_SERVICE_PORT:-8089}:8089"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: promotion-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8089/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  wishlist-service:
    build:
      context: ../..
      dockerfile: ./backend/wishlist-service/Dockerfile
    ports:
      - "${WISHLIST_SERVICE_PORT:-8094}:8094"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: wishlist-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8094/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  checkout-service:
    build:
      context: ../..
      dockerfile: ./backend/checkout-service/Dockerfile
    ports:
      - "${CHECKOUT_SERVICE_PORT:-8095}:8095"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: checkout-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8095/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  invoice-service:
    build:
      context: ../..
      dockerfile: ./backend/invoice-service/Dockerfile
    ports:
      - "${INVOICE_SERVICE_PORT:-8096}:8096"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: invoice-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8096/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  tracking-service:
    build:
      context: ../..
      dockerfile: ./backend/tracking-service/Dockerfile
    ports:
      - "${TRACKING_SERVICE_PORT:-8097}:8097"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: tracking-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8097/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  review-service:
    build:
      context: ../..
      dockerfile: ./backend/review-service/Dockerfile
    ports:
      - "${REVIEW_SERVICE_PORT:-8098}:8098"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: review-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8098/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  recommendation-service:
    build:
      context: ../..
      dockerfile: ./backend/recommendation-service/Dockerfile
    ports:
      - "${RECOMMENDATION_SERVICE_PORT:-8099}:8099"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: recommendation-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8099/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  analytics-service:
    build:
      context: ../..
      dockerfile: ./backend/analytics-service/Dockerfile
    ports:
      - "${ANALYTICS_SERVICE_PORT:-8100}:8100"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: analytics-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8100/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  finance-service:
    build:
      context: ../..
      dockerfile: ./backend/finance-service/Dockerfile
    ports:
      - "${FINANCE_SERVICE_PORT:-8101}:8101"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: finance-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8101/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  settlement-service:
    build:
      context: ../..
      dockerfile: ./backend/settlement-service/Dockerfile
    ports:
      - "${SETTLEMENT_SERVICE_PORT:-8103}:8103"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: settlement-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8103/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  support-service:
    build:
      context: ../..
      dockerfile: ./backend/support-service/Dockerfile
    ports:
      - "${SUPPORT_SERVICE_PORT:-8104}:8104"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: support-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8104/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  cms-service:
    build:
      context: ../..
      dockerfile: ./backend/cms-service/Dockerfile
    ports:
      - "${CMS_SERVICE_PORT:-8105}:8105"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: cms-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8105/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  admin-service:
    build:
      context: ../..
      dockerfile: ./backend/admin-service/Dockerfile
    ports:
      - "${ADMIN_SERVICE_PORT:-8106}:8106"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: admin-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8106/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  membership-service:
    build:
      context: ../..
      dockerfile: ./backend/membership-service/Dockerfile
    ports:
      - "${MEMBERSHIP_SERVICE_PORT:-8107}:8107"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: membership-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8107/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  subscription-service:
    build:
      context: ../..
      dockerfile: ./backend/subscription-service/Dockerfile
    ports:
      - "${SUBSCRIPTION_SERVICE_PORT:-8108}:8108"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: subscription-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8108/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  loyalty-service:
    build:
      context: ../..
      dockerfile: ./backend/loyalty-service/Dockerfile
    ports:
      - "${LOYALTY_SERVICE_PORT:-8109}:8109"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: loyalty-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8109/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  fraud-service:
    build:
      context: ../..
      dockerfile: ./backend/fraud-service/Dockerfile
    ports:
      - "${FRAUD_SERVICE_PORT:-8110}:8110"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: fraud-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8110/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  report-service:
    build:
      context: ../..
      dockerfile: ./backend/report-service/Dockerfile
    ports:
      - "${REPORT_SERVICE_PORT:-8111}:8111"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: report-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8111/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  audit-service:
    build:
      context: ../..
      dockerfile: ./backend/audit-service/Dockerfile
    ports:
      - "${AUDIT_SERVICE_PORT:-8112}:8112"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: audit-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8112/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network

  scheduler-service:
    build:
      context: ../..
      dockerfile: ./backend/scheduler-service/Dockerfile
    ports:
      - "${SCHEDULER_SERVICE_PORT:-8113}:8113"
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES:-prod}
      SPRING_APPLICATION_NAME: scheduler-service
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://discovery-server:8761/eureka/
      SPRING_CLOUD_CONFIG_URI: http://config-server:8888
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kartezy
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-kartezy}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET is required}
    depends_on:
      discovery-server:
        condition: service_healthy
      config-server:
        condition: service_healthy
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8113/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - kartezy-network"""


def main():
    import os
    compose_path = r"C:\Users\chaka\Kartezy\devops\docker\docker-compose.yml"
    
    with open(compose_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Insert after search-service block, before nginx block
    marker = "  # =====================\n  # Reverse Proxy"
    
    if marker in content:
        content = content.replace(marker, SERVICES_CONFIG + "\n\n" + marker)
        with open(compose_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("✅ Added 21 services to docker-compose.yml")
        print(f"   New file size: {len(content)} chars")
    else:
        print("❌ Could not find insertion marker in docker-compose.yml")


if __name__ == "__main__":
    main()
