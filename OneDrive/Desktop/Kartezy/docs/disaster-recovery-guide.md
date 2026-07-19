# Kartezy Disaster Recovery Guide

## Overview
This document outlines the disaster recovery procedures for the Kartezy Hyperlocal Quick Commerce Platform.

## Recovery Objectives
- **RPO (Recovery Point Objective):** 1 hour
- **RTO (Recovery Time Objective):** 4 hours for critical services, 24 hours for non-critical

## Backup Strategy

### Database Backups
| Database | Frequency | Method | Retention |
|----------|-----------|--------|-----------|
| PostgreSQL | Daily (2:00 AM) | pg_dump custom format | 30 days |
| MongoDB | Daily (2:30 AM) | mongodump with gzip | 30 days |
| Redis | Daily (3:00 AM) | RDB snapshot | 7 days |

### Configuration Backups
| Component | Frequency | Method | Retention |
|-----------|-----------|--------|-----------|
| Config Repo | Weekly (Sunday 3:00 AM) | tar archive | 90 days |
| Kubernetes Manifests | On change | Git | Permanent |
| Environment Variables | On change | Vault/Secrets | Permanent |

### Media Backups
| Component | Frequency | Method | Retention |
|-----------|-----------|--------|-----------|
| Uploaded Images | Daily | tar archive | 30 days |
| Product Images | Weekly | tar archive | 90 days |

## Restore Procedures

### PostgreSQL Restore
```bash
# Restore from custom format dump
pg_restore -h <host> -U <user> -d <database> --clean --if-exists postgres_<date>.dump

# Verify restore
psql -h <host> -U <user> -d <database> -c "SELECT count(*) FROM information_schema.tables;"
```

### MongoDB Restore
```bash
# Restore from gzipped archive
mongorestore --host <host> --username <user> --password <password> \
  --authenticationDatabase admin --nsInclude='kartezy.*' \
  --gzip --archive=mongodb_<date>.tar.gz
```

### Redis Restore
```bash
# Stop Redis, replace RDB file, restart
kubectl exec -n kartezy redis-0 -- redis-cli SHUTDOWN
kubectl cp redis_<date>.rdb kartezy/redis-0:/data/dump.rdb
kubectl rollout restart -n kartezy deployment/redis
```

## Disaster Scenarios

### Scenario 1: Database Corruption
1. Identify corrupted database
2. Scale down dependent services
3. Restore from latest backup
4. Replay Kafka events for data consistency
5. Verify data integrity
6. Scale up services

### Scenario 2: Full Region Outage
1. Activate secondary region (DR site)
2. Restore databases from latest backups
3. Deploy Kubernetes manifests from Git
4. Update DNS to point to DR region
5. Verify all services operational
6. Monitor for data consistency

### Scenario 3: Kubernetes Cluster Failure
1. Provision new cluster using IaC (Terraform)
2. Apply manifests from Git repository
3. Restore persistent volumes from backups
4. Verify service discovery (Eureka)
5. Verify API Gateway routing
6. Verify database connections

### Scenario 4: Security Breach
1. Isolate affected services
2. Rotate all credentials and secrets
3. Restore from pre-breach backups
4. Apply security patches
5. Conduct forensic analysis
6. Notify affected parties

## Incident Response

### Tier 1: Critical (P0)
- Complete service outage
- Data loss
- Security breach
- Payment processing failure
- **Response Time:** 15 minutes
- **Escalation:** CTO, SRE Lead

### Tier 2: High (P1)
- Partial service degradation
- High error rates (>5%)
- Database performance issues
- **Response Time:** 30 minutes
- **Escalation:** SRE Team

### Tier 3: Medium (P2)
- Non-critical feature outage
- Elevated latency
- Minor data inconsistencies
- **Response Time:** 2 hours
- **Escalation:** On-call Engineer

### Tier 4: Low (P3)
- Cosmetic issues
- Non-functional requests
- Documentation updates
- **Response Time:** Next business day
- **Escalation:** Engineering Team

## Recovery Verification

After any restore operation:
1. Run health checks on all services
2. Verify database connection pools
3. Check message queue connectivity
4. Validate API endpoints respond correctly
5. Monitor error rates for 1 hour
6. Verify business metrics (orders, revenue)
7. Document the incident and recovery steps

## Contact Information

| Role | Contact |
|------|---------|
| CTO | cto@kartezy.com |
| SRE Lead | sre@kartezy.com |
| Security Team | security@kartezy.com |
| Database Admin | dba@kartezy.com |
| DevOps Team | devops@kartezy.com |
