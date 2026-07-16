# Kartezy Disaster Recovery Guide

## 1. Disaster Recovery Strategy

### Recovery Objectives
- **RPO (Recovery Point Objective)**: 1 hour (max data loss)
- **RTO (Recovery Time Objective)**: 4 hours (max downtime)
- **RTO for Critical Services** (Orders, Payments): 30 minutes

### Availability Targets
- **Platform Availability**: 99.95% (< 4.5 hours downtime/year)
- **Order Processing**: 99.99% (< 1 hour downtime/year)
- **Payment Processing**: 99.99% (< 1 hour downtime/year)

## 2. Disaster Scenarios

### Scenario 1: Single Service Failure

**Symptoms**: Service-specific errors, degraded functionality
**Impact**: Partial platform degradation
**Response Time**: 15 minutes

**Recovery Steps**:
```bash
# 1. Check pod status
kubectl -n kartezy get pods | grep <service>

# 2. View recent logs
kubectl -n kartezy logs deployment/<service> --tail=50

# 3. Restart deployment
kubectl -n kartezy rollout restart deployment/<service>

# 4. Monitor recovery
kubectl -n kartezy rollout status deployment/<service> --timeout=120s

# 5. If unsuccessful, rollback
kubectl -n kartezy rollout undo deployment/<service>
```

### Scenario 2: Database Failure

**Symptoms**: Data access errors, services unable to start
**Impact**: Full platform outage
**Response Time**: Immediate

**Recovery Steps**:
```bash
# 1. Check database pod
kubectl -n kartezy get pods | grep postgres

# 2. Check PVC status
kubectl -n kartezy get pvc | grep postgres

# 3. If disk issue, restore from backup
# 3a. Find latest backup
ls -lt ./backups/

# 3b. Restore database
./scripts/restore-database.sh <latest-backup-timestamp>

# 4. If PVC corruption, recreate
kubectl -n kartezy delete pvc postgres-pvc
kubectl apply -f devops/kubernetes/infrastructure.yaml

# 5. Verify data integrity
kubectl -n kartezy exec deployment/postgres -- psql -U kartezy -c "SELECT count(*) FROM users;"
```

### Scenario 3: Complete Cluster Failure

**Symptoms**: All services down
**Impact**: Full platform outage
**Response Time**: Immediate

**Recovery Steps**:
```bash
# 1. Set up new Kubernetes cluster
# (Provision new cluster via Terraform/Pulumi)

# 2. Restore cluster state from GitOps repo
git clone https://github.com/kartezy/kartezy-infra.git
cd kartezy-infra

# 3. Apply infrastructure
kubectl apply -f devops/kubernetes/kartezy-namespace.yaml
kubectl apply -f devops/kubernetes/secrets.yaml
kubectl apply -f devops/kubernetes/infrastructure.yaml
kubectl apply -f devops/kubernetes/rbac.yaml
kubectl apply -f devops/kubernetes/service-infrastructure.yaml

# 4. Deploy services
kubectl apply -f devops/kubernetes/business-services.yaml
kubectl apply -f devops/kubernetes/ai-services.yaml

# 5. Apply networking
kubectl apply -f devops/kubernetes/ingress.yaml
kubectl apply -f devops/kubernetes/network-policies.yaml

# 6. Restore data from backups
./scripts/restore-database.sh <latest-backup>

# 7. Verify all services
kubectl -n kartezy get pods
```

### Scenario 4: Data Corruption

**Symptoms**: Invalid data, application errors
**Impact**: Partial/full outage depending on corruption extent
**Response Time**: 1 hour

**Recovery Steps**:
```bash
# 1. Identify corruption scope
# Check specific database tables

# 2. Restore specific table from backup
# PostgreSQL example:
pg_restore -h <host> -U kartezy -d kartezy \
    --table=orders \
    --clean \
    latest_backup.dump

# 3. Verify data consistency
# Run integrity checks

# 4. If widespread corruption, full restore
./scripts/restore-database.sh <backup-timestamp>
```

## 3. Backup Strategy

### Schedule
| Component | Frequency | Retention | Method |
|-----------|-----------|-----------|--------|
| PostgreSQL | Every 6 hours | 30 days | pg_dump |
| MongoDB | Every 12 hours | 30 days | mongodump |
| Redis | Every 24 hours | 7 days | SAVE/RDB |
| Elasticsearch | Every 6 hours | 14 days | Snapshot API |
| Configurations | On change | 90 days | Git backup |
| Media Files | Daily | 30 days | S3 sync |

### Backup Verification
- **Daily**: Automated integrity checks
- **Weekly**: Test restore to staging environment
- **Monthly**: Full DR drill with RTO/RPO validation

## 4. Infrastructure Recovery

### Kubernetes Cluster Recovery
```bash
# 1. Provision new cluster
# 2. Install dependencies:
#   - Ingress Controller (NGINX)
#   - Cert-Manager
#   - External Secrets
#   - Prometheus Stack
#   - Jaeger

# 3. Restore from GitOps
flux reconcile source git kartezy-infra
flux reconcile kustomization kartezy-infra

# 4. Verify
kubectl -n kartezy get all
```

### Terraform Recovery (If using IaC)
```hcl
# terraform init
# terraform plan
# terraform apply -auto-approve
```

## 5. Communication Plan

### Status Page
- **URL**: status.kartezy.com
- **Updates**: Every 30 minutes during incident

### Stakeholder Communication
1. **Internal** (first 15 minutes): Slack #incidents
2. **Management** (first 30 minutes): Email + Slack
3. **Customers** (first 60 minutes): Status page update
4. **Public** (if significant): Social media + blog post

### Post-Incident
- **Root Cause Analysis**: Within 48 hours
- **Prevention Plan**: Within 72 hours
- **Incident Report**: Within 1 week

## 6. Recovery Testing

### Monthly DR Drill
```bash
# 1. Schedule maintenance window
# 2. Test backup restoration:
./scripts/restore-database.sh latest

# 3. Verify data integrity
# 4. Test failover:
#   - DNS failover
#   - Database failover
#   - Service failover

# 5. Document results and improvement areas
```

### Success Criteria
- [ ] RPO met (< 1 hour data loss)
- [ ] RTO met (< 4 hours recovery)
- [ ] Critical services restored in < 30 minutes
- [ ] All data consistent and verified
- [ ] Monitoring and alerting operational
- [ ] Stakeholders notified per plan

## 7. Contact Tree

```yaml
Primary On-Call:
  - Role: SRE
  - Contact: [PagerDuty]
  - Escalation: 15 min

Engineering Manager:
  - Role: EM
  - Contact: [Phone/Slack]
  - Escalation: 30 min

VP Engineering:
  - Role: VP Eng
  - Contact: [Phone]
  - Escalation: 1 hour

CTO:
  - Role: CTO
  - Contact: [Phone]
  - Escalation: 2 hours
```
