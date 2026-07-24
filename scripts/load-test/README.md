# Kartezy Enterprise Load Testing

## Overview

k6-based load testing scripts for performance validation of all critical endpoints.

## Prerequisites

- Install [k6](https://k6.io/docs/get-started/installation/)
- Ensure services are running (locally or in staging)

## Quick Start

### 1. Basic Smoke Test (5 users, 1 minute)
```bash
k6 run --vus 5 --duration 1m k6-load-test.js
```

### 2. Standard Load Test (ramp up to 100 users)
```bash
k6 run --vus 50 --duration 5m k6-load-test.js
```

### 3. Stress Test (ramp up to 500 users)
```bash
k6 run --vus 200 --duration 10m --max 500 k6-load-test.js
```

### 4. Spike Test (sudden traffic surge)
```bash
k6 run --vus 0 --duration 1m \
  --stage 0s:0,10s:300,30s:300,60s:0 \
  k6-load-test.js
```

### 5. Against a specific environment
```bash
# Staging
k6 run -e BASE_URL=https://staging.kartezy.com/api k6-load-test.js

# Production (read-only routes)
k6 run -e BASE_URL=https://api.kartezy.com k6-load-test.js
```

## Performance Baselines

| Endpoint | Target p95 | Target p99 | Max RPS |
|----------|-----------|-----------|---------|
| Login | 2s | 5s | 500 |
| Search | 1s | 2s | 2000 |
| Product Details | 1.5s | 3s | 3000 |
| Place Order | 3s | 5s | 200 |
| Nearby Stores | 2s | 4s | 1000 |
| Wallet Balance | 1s | 2s | 1000 |
| Categories (cached) | 500ms | 1s | 5000 |

## Test Profiles

| Profile | VUs | Duration | Purpose |
|---------|-----|----------|---------|
| Smoke | 5 | 1m | Verify basic functionality |
| Standard | 50 | 5m | Normal traffic patterns |
| Load | 200 | 10m | Sustained peak load |
| Stress | 500 | 15m | Find breaking point |
| Spike | 0→300→0 | 2m | Sudden traffic surge |
| Soak | 100 | 60m | Long-running stability |

## Metrics Collected

- `http_req_duration` - API response time
- `http_req_failed` - Error rate
- `order_latency_ms` - Order placement latency
- `search_latency_ms` - Search API latency
- `login_latency_ms` - Authentication latency
- `payment_latency_ms` - Payment processing latency

## CI/CD Integration

```yaml
# GitHub Actions - add to any workflow
- name: Run k6 Load Test
  uses: grafana/k6-action@v0.3.0
  with:
    filename: scripts/load-test/k6-load-test.js
    flags: --vus 20 --duration 2m
    env: |
      BASE_URL=https://staging.kartezy.com/api
```

## Interpreting Results

Look for:
- **p95 < 2s** for most endpoints
- **Error rate < 5%** under load
- **No connection timeouts** in connection pool
- **CPU < 80%** on database and app servers
- **No circuit breaker trips** at target load

## Generating Reports

```bash
# HTML report
k6 run --summary-trend-stats="avg,min,med,max,p(90),p(95),p(99)" \
  --out json=results.json k6-load-test.js

# InfluxDB + Grafana
k6 run --out influxdb=http://localhost:8086/k6 k6-load-test.js
```
