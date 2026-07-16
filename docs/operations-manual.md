# Kartezy Operations Manual

## 1. System Overview

### Platform Architecture
- **30+ Microservices**: Spring Boot 3 backend services
- **3 Mobile Apps**: Customer, Merchant, Delivery (Flutter)
- **2 Web Apps**: Admin Dashboard, Customer Website (Next.js)
- **AI Platform**: TensorFlow.js based ML inference
- **5 Data Stores**: PostgreSQL, MongoDB, Redis, Elasticsearch, Kafka

### Key Business Flows
1. **Order Lifecycle**: Browse → Cart → Checkout → Payment → Preparation → Delivery → Complete
2. **Merchant Onboarding**: Registration → KYC → Document Upload → Approval → Go Live
3. **Delivery Assignment**: Order Placed → Nearby Partner → Accept → Pickup → Deliver

## 2. Monitoring Dashboards

### Grafana
- **URL**: `https://grafana.kartezy.com`
- **Default Dashboards**:
  - System Overview: CPU, Memory, Disk, Network
  - Service Health: UP/DOWN status, error rates, response times
  - Business KPIs: Orders/hour, Revenue, Active Users
  - Database: Connection pools, query performance, disk usage
  - Kafka: Message rates, consumer lag

### Prometheus
- **URL**: `https://prometheus.kartezy.com`
- **Alerting Rules**:
  - P0: Service down > 1 minute
  - P1: Error rate > 5% for 2 minutes
  - P2: CPU/Memory > 80% for 5 minutes
  - P3: Disk space < 10%

### Jaeger (Distributed Tracing)
- **URL**: `https://jaeger.kartezy.com`
- **Usage**: Trace end-to-end requests across microservices

## 3. Logging

### Centralized Logging
All services output structured JSON logs to stdout. In production, use ELK stack or Loki.

**Log Levels**:
- `ERROR`: System failures requiring immediate attention
- `WARN`: Degraded functionality, non-critical issues
- `INFO`: Business events, state changes
- `DEBUG`: Troubleshooting (enable per-service)
- `TRACE`: Detailed request tracing

### Log Format
```json
{
  "@timestamp": "2024-01-01T12:00:00.000Z",
  "level": "INFO",
  "service": "order-service",
  "traceId": "abc123",
  "spanId": "def456",
  "message": "Order created successfully",
  "orderId": "ORD-12345",
  "amount": 499.00,
  "userId": "USR-67890",
  "duration_ms": 150
}
```

## 4. Incident Response

### Severity Levels

| Level | Response Time | Example |
|-------|--------------|---------|
| **P0** | 15 minutes | Service outage, payment failures |
| **P1** | 1 hour | High error rate, degraded performance |
| **P2** | 4 hours | Minor issues, non-critical bugs |
| **P3** | 24 hours | Cosmetic issues, feature requests |

### Incident Response Procedure

1. **Detect**: Monitor alerts or user reports
2. **Acknowledge**: Confirm alert within SLA
3. **Assess**: Determine severity and impact
4. **Mitigate**: Apply immediate fix (rollback, scale, feature flag)
5. **Resolve**: Implement permanent fix
6. **Post-mortem**: Document root cause and prevention

### Common Runbooks

#### Service Down
```bash
# Check pod status
kubectl -n kartezy get pods | grep <service>

# View logs
kubectl -n kartezy logs deployment/<service> --tail=100

# Describe pod for errors
kubectl -n kartezy describe pod <pod-name>

# Restart deployment
kubectl -n kartezy rollout restart deployment/<service>

# Rollback if needed
kubectl -n kartezy rollout undo deployment/<service>
```

#### Database Issues
```bash
# Check PostgreSQL health
kubectl -n kartezy exec -it deployment/postgres -- pg_isready

# Check connection count
kubectl -n kartezy exec -it deployment/postgres -- psql -U kartezy -c "SELECT count(*) FROM pg_stat_activity;"

# Check slow queries
kubectl -n kartezy exec -it deployment/postgres -- psql -U kartezy -c "SELECT query, state, wait_event FROM pg_stat_activity WHERE state != 'idle';"
```

#### Kafka Issues
```bash
# Check consumer lag
kubectl -n kartezy exec -it deployment/kafka -- kafka-consumer-groups --bootstrap-server localhost:9092 --list

# Describe specific consumer group
kubectl -n kartezy exec -it deployment/kafka -- kafka-consumer-groups --bootstrap-server localhost:9092 --group <group> --describe
```

## 5. Database Administration

### PostgreSQL

```sql
-- Active connections
SELECT pid, usename, application_name, state, query 
FROM pg_stat_activity 
WHERE state != 'idle';

-- Table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- Slow queries (> 5 seconds)
SELECT query, calls, total_exec_time, rows, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Redis

```bash
# Monitor commands
redis-cli -h <host> monitor

# Check memory
redis-cli -h <host> info memory

# Key statistics
redis-cli -h <host> info stats
```

## 6. Capacity Planning

### Current Resource Allocation (per service)

| Service Type | CPU Request | CPU Limit | Memory Request | Memory Limit | Replicas |
|-------------|-------------|-----------|----------------|--------------|----------|
| API Gateway | 250m | 500m | 256Mi | 512Mi | 2-10 |
| Business Service | 250m | 500m | 384Mi | 768Mi | 2-8 |
| AI Service | 500m | 2 | 512Mi | 2Gi | 1-6 |
| Database | 500m | 1 | 1Gi | 2Gi | 1-3 |

### Scaling Triggers
- CPU utilization > 70%
- Memory utilization > 80%
- Request rate > configurable threshold

## 7. Maintenance Windows

**Recommended**: Sunday 02:00-04:00 (lowest traffic)

### Procedure
1. Notify stakeholders 48h in advance
2. Enable maintenance mode on website
3. Drain connections gracefully
4. Perform maintenance
5. Verify health checks
6. Disable maintenance mode

## 8. Backup Verification

Monthly restore test procedure:
```bash
# 1. Create a test database
createdb kartezy_restore_test

# 2. Restore latest backup
pg_restore -d kartezy_restore_test latest_backup.dump

# 3. Verify data integrity
psql -d kartezy_restore_test -c "SELECT count(*) FROM users;"
psql -d kartezy_restore_test -c "SELECT count(*) FROM orders;"

# 4. Drop test database
dropdb kartezy_restore_test
```

## 9. Security Operations

### Secret Rotation
- JWT secrets: Every 90 days
- Database passwords: Every 180 days
- API keys: Every 12 months or on compromise

### Access Reviews
- Review Kubernetes RBAC: Quarterly
- Review database access: Quarterly
- Review API keys: Bi-annually

## 10. Contact Information

### On-Call
- **Primary SRE**: [On-call schedule]
- **Escalation**: Engineering Manager → VP Engineering

### Communication Channels
- **Alerts**: PagerDuty / OpsGenie
- **Incident Chat**: #incidents Slack channel
- **Status Page**: status.kartezy.com
