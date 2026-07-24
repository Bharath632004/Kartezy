# Kartezy Enterprise Scalability & Performance Guide

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Global DNS / CDN                        │
├─────────────────────────────────────────────────────────────┤
│                     Nginx Load Balancer                     │
├─────────────────────────────────────────────────────────────┤
│                     API Gateway (Scalable)                  │
│          Rate Limiting → Auth → Routing → Throttle          │
├─────────────┬──────────────┬───────────────┬────────────────┤
│ Business    │ Read-Heavy   │ Data          │ Async          │
│ Services    │ Services     │ Services      │ Processing     │
│             │              │               │                │
│ auth-svc    │ catalog-svc  │ order-svc     │ Kafka          │
│ user-svc    │ search-svc   │ payment-svc   │ RabbitMQ       │
│ merchant-svc│ inventory-svc│ wallet-svc    │ Notifications  │
│ delivery-svc│              │ invoice-svc   │ Scheduler      │
├─────────────┴──────────────┴───────────────┴────────────────┤
│                     Data Layer                              │
│   PostgreSQL Primary ↔ Replica   Redis Cluster   ES Cluster │
└─────────────────────────────────────────────────────────────┘
```

## 2. Caching Strategy

### 2.1 Multi-Tier Cache

| Tier | Technology | TTL | Purpose |
|------|-----------|-----|---------|
| L1 - Application | In-Memory (Caffeine) | Milliseconds | Hot data, frequent reads |
| L2 - Distributed | Redis Cluster | Seconds-Minutes | Shared cache across pods |
| L3 - CDN | CloudFront/Cloudflare | Minutes-Hours | Static assets, images |

### 2.2 Cache Configurations

| Cache Name | TTL | Strategy | Invalidation |
|-----------|-----|----------|-------------|
| `categories` | 30 min | Write-through | On category CRUD |
| `brands` | 30 min | Write-through | On brand CRUD |
| `products` | 5 min | Write-behind | On price/inventory change |
| `productDetails` | 5 min | Cache-aside | On product update |
| `stores` | 10 min | Cache-aside | On store hours update |
| `inventory` | 2 min | Write-through | On stock mutation |
| `search` | 1 min | Cache-aside | On search |
| `autocomplete` | 5 min | Pre-warmed | Periodic refresh |
| `users` | 15 min | Cache-aside | On profile update |
| `orders` | 2 min | Write-through | On status change |
| `orderStatus` | 30 sec | Cache-aside | Near-real-time |
| `pricing` | 15 min | Pre-warmed | On price change |
| `cms` | 1 hour | Pre-warmed | On CMS publish |

## 3. Database Scaling

### 3.1 Connection Pooling

| Parameter | Primary (Write) | Replica (Read) | Rationale |
|-----------|----------------|----------------|-----------|
| max-pool-size | 20 | 30 | Writes are transactional |
| min-idle | 5 | 10 | Replicas handle more connections |
| idle-timeout | 5 min | 5 min | Standard |
| max-lifetime | 20 min | 20 min | Connection refresh |
| connection-timeout | 5s | 5s | Fail fast |
| leak-detection | 60s | 60s | Debug connection leaks |

### 3.2 Read Replica Configuration

```yaml
spring:
  datasource:
    url: jdbc:postgresql://primary-host:5432/kartezy
    read-replica:
      url: jdbc:postgresql://replica-host:5432/kartezy
      maximum-pool-size: 30
```

Read/write splitting is handled at the application layer:
- **Reads**: Search, catalog browsing, user profiles, store listings
- **Writes**: Orders, payments, inventory mutations, user registration

### 3.3 Query Optimization

- Use `EXPLAIN ANALYZE` on all slow queries (>100ms)
- Add composite indexes for common query patterns
- Use partial indexes for filtered queries
- Implement query result pagination (cursor-based for large datasets)
- Use `FOR UPDATE SKIP LOCKED` for queue-like tables

## 4. Async Processing

### 4.1 Thread Pools

| Pool Name | Core | Max | Queue | Purpose |
|-----------|------|-----|-------|---------|
| `taskExecutor` | 8 | 16 | 100 | General async tasks |
| `notificationExecutor` | 4 | 8 | 200 | Email/SMS/Push |
| `eventExecutor` | 6 | 12 | 500 | Kafka/WebSocket events |
| `backgroundExecutor` | 2 | 4 | 50 | CPU-intensive jobs |

### 4.2 Message Queues

| Queue | Type | Consumers | Use Case |
|-------|------|-----------|----------|
| `order-events` | Kafka | Order, Payment, Notification | Order lifecycle events |
| `payment-events` | Kafka | Payment, Order, Wallet | Payment confirmations |
| `notification-queue` | RabbitMQ | Notification | Email/SMS/Push delivery |
| `delivery-tracking` | Kafka | Delivery, Tracking | Real-time location |
| `analytics-events` | Kafka | Analytics | User behavior events |

## 5. Resilience Patterns

### 5.1 Circuit Breaker Configuration

| Service | Window | Failure Threshold | Open Duration | Half-Open Calls |
|---------|--------|------------------|---------------|-----------------|
| Payment | 10 calls | 30% | 30s | 3 |
| Order | 20 calls | 40% | 15s | 5 |
| Catalog | 30 calls | 50% | 10s | 5 |
| Delivery | 15 calls | 35% | 20s | 3 |
| Notification | 10 calls | 60% | 60s | 2 |

### 5.2 Retry Configuration

| Operation | Max Attempts | Base Wait | Multiplier | Max Wait |
|-----------|-------------|-----------|------------|----------|
| Payment processing | 3 | 500ms | 2.0 | 5s |
| Default operations | 3 | 200ms | 1.5 | - |
| Idempotent reads | 5 | 100ms | 2.0 | 3s |

## 6. Auto-Scaling

### 6.1 Horizontal Pod Autoscaling

| Service | Min | Max | CPU Target | Custom Metric | Metric Target |
|---------|-----|-----|-----------|--------------|---------------|
| API Gateway | 3 | 20 | 60% | req/s | 1000 |
| Auth Service | 3 | 15 | 60% | logins/s | 200 |
| Order Service | 3 | 20 | 65% | orders/s | 50 |
| Catalog Service | 2 | 12 | 70% | search/s | 500 |
| Payment Service | 2 | 10 | 60% | payments/s | 100 |
| Delivery Service | 2 | 12 | 70% | deliveries/s | 100 |
| Notification Service | 2 | 10 | 70% | queue depth | 500 |

### 6.2 Vertical Pod Autoscaling

| Service | Memory Request | Memory Limit | CPU Request | CPU Limit |
|---------|---------------|--------------|-------------|-----------|
| API Gateway | 512Mi | 1Gi | 500m | 1000m |
| Auth Service | 512Mi | 1Gi | 500m | 1000m |
| Order Service | 1Gi | 2Gi | 500m | 1000m |
| Catalog Service | 1Gi | 2Gi | 500m | 1000m |
| Payment Service | 512Mi | 1Gi | 500m | 1000m |
| Search Service | 1Gi | 2Gi | 500m | 1000m |

## 7. Performance Monitoring

### 7.1 Key Metrics

| Category | Metric | Alert Threshold | Severity |
|----------|-------|-----------------|----------|
| **API Performance** | p95 latency | > 2s | P1 |
| | p99 latency | > 5s | P1 |
| | Error rate | > 5% | P2 |
| **Database** | Connection pool usage | > 80% | P2 |
| | Slow queries | > 100ms | P3 |
| | Replication lag | > 10s | P2 |
| **Cache** | Hit rate | < 70% | P2 |
| | Eviction rate | > 1% | P3 |
| **Messaging** | Consumer lag | > 1000 | P2 |
| | Queue depth | > 5000 | P1 |
| **Business** | Order throughput | < expected | P2 |
| | Payment failures | > 2% | P1 |

### 7.2 Prometheus Custom Metrics

All services expose the following custom metrics:
- `kartezy_orders_created_total` — Order throughput
- `kartezy_payments_processed_total` — Payment throughput
- `kartezy_auth_logins_total` (tags: success/failed) — Auth performance
- `kartezy_api_latency_seconds` (p50, p95, p99) — API response times
- `kartezy_db_query_latency_seconds` — Database performance
- `kartezy_cache_hit_rate` — Cache effectiveness
- `kartezy_errors_total` (tags: service, errorType) — Error tracking

## 8. Performance Baselines

| Operation | Target (p95) | Max (p99) | RPS Capacity |
|-----------|-------------|-----------|-------------|
| User Login | 1.5s | 3s | 500/s |
| Search Products | 800ms | 2s | 2000/s |
| Product Details | 1s | 2.5s | 3000/s |
| Create Order | 2s | 4s | 200/s |
| Process Payment | 3s | 5s | 100/s |
| Browse Categories | 300ms | 1s | 5000/s |
| Nearby Stores | 1.5s | 3s | 1000/s |
| Delivery Tracking | 200ms | 500ms | 2000/s |
| Wallet Operations | 800ms | 2s | 1000/s |

## 9. Capacity Planning

### 9.1 Growth Assumptions

| Metric | Month 1 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Daily Active Users | 10,000 | 50,000 | 200,000 |
| Orders/Day | 5,000 | 25,000 | 100,000 |
| API Requests/Sec | 100 | 500 | 2,000 |
| Data Volume | 10GB | 50GB | 200GB |

### 9.2 Infrastructure Scaling

| Component | Month 1 | Month 6 | Month 12 |
|-----------|---------|---------|----------|
| App Pods | 2-3 each | 5-10 each | 10-20 each |
| PostgreSQL | 1 writer + 1 reader | 1 writer + 2 readers | 2 writers + 4 readers |
| Redis | 3-node cluster | 6-node cluster | 12-node cluster |
| Kafka | 3 brokers | 6 brokers | 12 brokers |
| Elasticsearch | 3 nodes | 5 nodes | 10 nodes |

## 10. Load Testing Schedule

| Test Type | Frequency | VUs | Duration |
|-----------|-----------|-----|----------|
| Smoke Test | Every commit | 5 | 1m |
| Load Test | Every release | 200 | 10m |
| Stress Test | Monthly | 500 | 15m |
| Soak Test | Quarterly | 100 | 60m |
| Spike Test | Quarterly | 500 | 2m |

---

*Document Version: 1.0*
*Last Updated: July 2026*
*Review Cycle: Quarterly*
