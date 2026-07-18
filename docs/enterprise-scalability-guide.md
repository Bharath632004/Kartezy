# Kartezy Enterprise Scalability Guide

## Overview

Kartezy is built for enterprise-grade scalability from day one. This guide documents all the enterprise scalability features implemented across the platform.

## Scalability Dimensions

### 1. Multi-City Operations

Kartezy supports deployment across any number of cities with full isolation and independent configuration.

**Components:**
- `City` entity in `kartezy_enterprise.cities` table
- City-level configuration (timezone, currency, language)
- Geo-routing via `GeoRoutingService`
- City-specific delivery zones and pricing

**Configuration:**
```yaml
kartezy.enterprise.geography.max-city-radius-km: 25
```

**API:**
- `GET /api/enterprise/geography/cities` - List all cities
- `GET /api/enterprise/geography/cities/{code}` - City details
- `POST /api/enterprise/geography/cities` - Add new city

### 2. Multi-State Operations

Platform supports all states/provinces with tax handling and regional rules.

**Components:**
- `State` entity with tax configuration
- State-specific tax calculations (GST, VAT, Sales Tax)
- Regional restrictions and compliance rules

**Key Features:**
- State-specific tax rates
- Regional delivery restrictions
- Sunday operations configuration
- Alcohol/banned items management

### 3. Multi-Country Operations

Full international expansion support with country-specific configurations.

**Components:**
- `Country` entity with ISO codes
- Country-level compliance (GDPR, data localization)
- Multi-currency and multi-language per country
- Country-specific tax systems (GST, VAT, Sales Tax)

**Configuration:**
```yaml
kartezy.enterprise.geography.supported-countries: IN,US,AE,SG,MY,GB
```

### 4. Multi-Tenant Architecture

Complete multi-tenant isolation with flexible provisioning.

**Components:**
- `TenantContext` - Thread-local tenant propagation
- `TenantFilter` - Servlet filter for tenant resolution
- `TenantResolver` - Header/subdomain/domain-based resolution
- `TenantProvisioningService` - Automated tenant onboarding
- `TenantAspect` - Context propagation for async operations

**Isolation Strategies:**
- Schema per tenant (default)
- Database per tenant (for higher isolation)

**Tenant Resolution Priority:**
1. `X-Tenant-Id` header
2. Subdomain (`tenant.kartezy.com`)
3. Custom domain (`tenant.com`)
4. JWT claims
5. API key

**Configuration:**
```yaml
kartezy.enterprise.multitenant:
  enabled: true
  schema-strategy: schema_per_tenant
  cache-enabled: true
  cache-ttl-seconds: 300
```

### 5. Multi-Language (i18n)

Full internationalization with support for 20+ languages including all major Indian languages.

**Components:**
- `TranslationService` - Dynamic translation resolution
- `LocaleContext` - Thread-local locale propagation
- `LocaleResolverFilter` - Automatic locale detection
- RTL (Right-to-Left) language support

**Supported Languages:**
| Code | Language | RTL |
|------|----------|-----|
| en | English | No |
| hi | हिन्दी | No |
| bn | বাংলা | No |
| te | తెలుగు | No |
| mr | मराठी | No |
| ta | தமிழ் | No |
| gu | ગુજરાતી | No |
| kn | ಕನ್ನಡ | No |
| ml | മലയാളം | No |
| pa | ਪੰਜਾਬੀ | No |
| or | ଓଡ଼ିଆ | No |
| ar | العربية | Yes |
| fr | Français | No |
| es | Español | No |
| zh | 中文 | No |
| ja | 日本語 | No |
| ko | 한국어 | No |

**Locale Resolution Priority:**
1. `X-Language` header
2. `X-Locale` header
3. `Accept-Language` header
4. `lang` query parameter
5. Default tenant language

**Configuration:**
```yaml
kartezy.enterprise.i18n:
  enabled: true
  default-language: en
  fallback-language: en
```

### 6. Multi-Currency

Complete multi-currency support with real-time exchange rates.

**Components:**
- `ExchangeRateService` - Rate management and conversion
- `CurrencyContext` - Thread-local currency propagation
- `CurrencyFormatter` - Locale-aware formatting
- `CurrencyResolverFilter` - Automatic currency detection

**Supported Currencies:**
INR, USD, EUR, GBP, JPY, AED, SAR, SGD, MYR, THB, CNY, AUD, CAD, CHF, LKR, NPR, BDT, PKR

**Configuration:**
```yaml
kartezy.enterprise.currency:
  enabled: true
  default-currency: INR
  rate-update-interval-minutes: 60
```

### 7. Multi-Timezone

Timezone-aware operations for global scheduling and reporting.

**Components:**
- `TimezoneService` - Conversion and DST handling
- `TimezoneContext` - Thread-local timezone propagation
- `TimezoneResolverFilter` - Automatic timezone detection

**Supported Timezones:** 45+ timezones across all major regions.

**Configuration:**
```yaml
kartezy.enterprise.timezone:
  enabled: true
  default-timezone: Asia/Kolkata
```

### 8. White Label Ready

Full white labeling for enterprise tenants with complete brand customization.

**Components:**
- `WhiteLabelConfig` - Brand configuration model
- `WhiteLabelService` - Brand management service
- CSS variable generation for dynamic theming
- Custom domain support with SSL

**Customizable Elements:**
- Company name, tagline, logo
- Color scheme (primary, secondary, accent, backgrounds)
- Typography (fonts, sizes)
- Custom CSS/JS injection
- Custom domain with SSL
- Email templates with branding
- Support contact information
- Legal documents (privacy, terms)
- Social media links
- Feature flags per tenant

**Configuration:**
```yaml
kartezy.enterprise.whitelabel:
  enabled: true
  allow-custom-domain: true
  allow-custom-css: true
```

### 9. Franchise Ready

Complete franchise management system for multi-unit operations.

**Components:**
- `Franchise` entity with tiered pricing
- `FranchiseService` - Lifecycle management
- Commission and royalty calculations
- Territory management

**Franchise Tiers:**
- BASIC
- STANDARD
- PREMIUM
- ENTERPRISE

**Franchise Statuses:**
- PENDING → ONBOARDING → ACTIVE → SUSPENDED → TERMINATED

### 10. Marketplace Ready

Full multi-vendor marketplace with commission management.

**Components:**
- `Vendor` entity with KYC
- `MarketplaceService` - Vendor and order management
- `CommissionConfig` - Flexible commission models
- Multi-vendor cart support
- Automated settlements

**Commission Models:**
- PERCENTAGE
- FLAT
- TIERED
- CATEGORY_BASED
- SLAB_BASED

**Payout Modes:**
- DAILY
- WEEKLY
- BIWEEKLY
- MONTHLY

### 11. Warehouse Ready

Complete Warehouse Management System (WMS).

**Components:**
- `Warehouse` entity with capacity tracking
- `InventoryItem` - Real-time stock management
- `StockTransfer` - Inter-warehouse transfers
- `WarehouseService` - Operations management

**Warehouse Types:**
- FULFILLMENT
- DISTRIBUTION
- CROSS_DOCK
- MICRO_FULFILLMENT
- DARK_STORE
- RETURNS_PROCESSING

**Features:**
- Zone/aisle/shelf/bin location management
- Batch number tracking
- Expiry date management
- Low stock alerts
- Auto-replenishment
- Picking station management

### 12. Vendor Ready

Complete vendor procurement and purchase order management.

**Components:**
- `Vendor` entity with procurement focus
- `PurchaseOrder` - Full PO lifecycle
- `VendorProcurementService` - Procurement operations

**PO Statuses:**
DRAFT → PENDING_APPROVAL → APPROVED → SENT_TO_VENDOR → CONFIRMED → IN_TRANSIT → PARTIALLY_RECEIVED → COMPLETED → CANCELLED

### 13. Horizontal Scaling

All services support horizontal scaling with HPA configured.

**Features:**
- CPU-based autoscaling (target: 60-70% utilization)
- Memory-based autoscaling (target: 75-80%)
- Custom metrics scaling (request rate, queue depth, connection count)
- Predictive scaling with stabilization windows
- Fast scale-up, conservative scale-down

**Scaling Configurations:**
| Service | Min | Max | Custom Metrics |
|---------|-----|-----|----------------|
| API Gateway | 3 | 20 | RPS, Connections |
| Auth Service | 3 | 15 | Login RPS |
| Order Service | 3 | 20 | Orders/s, Kafka Lag |
| Payment Service | 2 | 10 | Payment RPS |
| Delivery Service | 2 | 12 | Active Deliveries |
| AI Service | 2 | 15 | Inference RPS |

### 14. Auto Scaling

Enhanced auto scaling with multiple metric sources.

**Metric Sources:**
1. CPU utilization
2. Memory utilization
3. Custom request metrics
4. Kafka consumer lag
5. RabbitMQ queue depth
6. Active connections/sessions
7. Concurrent conversations (chatbot)

**Scaling Behavior:**
- Scale-up: Aggressive (100% increase per 30s)
- Scale-down: Conservative (25% decrease per 120s)
- Stabilization windows prevent thrashing

### 15. Disaster Recovery

Comprehensive disaster recovery with automated backups and restore.

**Components:**
- `enterprise-backup.sh` - Automated backup script
- `enterprise-restore.sh` - Point-in-time recovery
- `enterprise-health-check.sh` - System health verification

**Backup Schedule:**
| Component | Frequency | Retention |
|-----------|-----------|-----------|
| PostgreSQL | Every 6 hours | 30 days |
| MongoDB | Every 12 hours | 30 days |
| Redis | Daily | 7 days |
| Elasticsearch | Every 6 hours | 14 days |

**Recovery Objectives:**
- RPO: 1 hour (max data loss)
- RTO: 4 hours (max downtime)
- Critical services (Orders, Payments): 30 minutes RTO

**Disaster Scenarios:**
1. Single Service Failure - 15 min response
2. Database Failure - Immediate response
3. Complete Cluster Failure - Immediate response
4. Data Corruption - 1 hour response

### 16. Geo Replication

Cross-region deployment for global availability.

**Configured Regions:**
| Region | Code | Cities | Status |
|--------|------|--------|--------|
| Mumbai (India) | ap-south-1 | Mumbai, Pune, Delhi, Bangalore, Chennai | Primary |
| Virginia (USA) | us-east-1 | New York, Boston, Washington DC | Standby |
| Ireland (Europe) | eu-west-1 | London, Dublin, Paris | Standby |
| Singapore (SE Asia) | ap-southeast-1 | Singapore, Kuala Lumpur, Jakarta | Standby |
| Dubai (Middle East) | me-central-1 | Dubai, Abu Dhabi, Riyadh | Standby |

**Replication Strategy:**
- Active-Passive with automatic failover
- PostgreSQL streaming replication
- Cross-region Kafka mirroring
- Global load balancer (DNS-based)
- Health-checked failover (30s interval)

## Production Readiness Checklist

### Deployment
- [ ] Database schema applied (`enterprise-schema.sql`)
- [ ] MongoDB indexes created (`enterprise-indexes.js`)
- [ ] Kubernetes manifests applied
- [ ] Secrets configured via External Secrets Manager
- [ ] TLS certificates provisioned
- [ ] DNS records configured
- [ ] Monitoring dashboards imported
- [ ] Alert rules configured

### Operations
- [ ] Backup schedule configured (cron)
- [ ] Restore tested (monthly)
- [ ] Health check script deployed
- [ ] Runbooks documented
- [ ] On-call rotation established
- [ ] Escalation paths defined

### Security
- [ ] Tenant isolation verified
- [ ] Rate limiting configured
- [ ] Network policies applied
- [ ] Secrets rotated
- [ ] Audit logging enabled
- [ ] WAF rules configured

### Business Continuity
- [ ] DR plan documented
- [ ] Failover tested
- [ ] Backup verified
- [ ] RPO/RTO validated
- [ ] Communication plan ready
- [ ] Status page configured

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Global Load Balancer                      │
│              (DNS-based Geo Routing)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
     ┌─────────────────┼─────────────────┐
     ▼                 ▼                 ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│ ap-south-1 │  │ us-east-1  │  │ eu-west-1  │
│ (Primary)  │  │ (Standby)  │  │ (Standby)  │
└──────┬─────┘  └──────┬─────┘  └──────┬─────┘
       │                │                │
       ▼                ▼                ▼
┌─────────────────────────────────────────────────┐
│           Multi-Tenant API Gateway               │
│  (Tenant Resolution, Rate Limiting, Auth)        │
└────────────┬────────────────────┬───────────────┘
             │                    │
     ┌───────┴────────┐  ┌───────┴────────┐
     ▼                ▼  ▼                ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│Business  │    │Enterprise│    │  AI/ML   │
│Services  │    │Services  │    │Services  │
│          │    │          │    │          │
│• Auth    │    │• Tenant  │    │• AI      │
│• Orders  │    │• Warehouse│   │• NLP     │
│• Payment │    │• Vendor  │    │• Vision  │
│• Catalog │    │• Franchise│   │• Chat    │
│• Delivery│    │•Marketpl.│    │• Forecast│
└──────────┘    └──────────┘    └──────────┘
       │                │                │
       └────────────────┼────────────────┘
                        ▼
┌─────────────────────────────────────────────────┐
│                 Data Layer                        │
│                                                   │
│  ┌──────────┐ ┌──────┐ ┌────────┐ ┌──────────┐  │
│  │PostgreSQL│ │Redis │ │ Kafka  │ │Elasticsearch│
│  │(Sharded) │ │(Cache)│ │(Events)│ │ (Search)  │  │
│  └──────────┘ └──────┘ └────────┘ └──────────┘  │
│                                                   │
│  Geo-Replicated with Cross-Region Failover        │
└─────────────────────────────────────────────────┘
```

## Environment Variables

Add to `.env`:
```env
# Enterprise Features
KARTZY_ENTERPRISE_MULTITENANT_ENABLED=true
KARTZY_ENTERPRISE_I18N_ENABLED=true
KARTZY_ENTERPRISE_CURRENCY_ENABLED=true
KARTZY_ENTERPRISE_TIMEZONE_ENABLED=true
KARTZY_ENTERPRISE_GEOGRAPHY_ENABLED=true
KARTZY_ENTERPRISE_MARKETPLACE_ENABLED=true
KARTZY_ENTERPRISE_WAREHOUSE_ENABLED=true
KARTZY_ENTERPRISE_FRANCHISE_ENABLED=false
KARTZY_ENTERPRISE_WHITELABEL_ENABLED=false
KARTZY_ENTERPRISE_GEO_REPLICATION_ENABLED=false

# Enterprise Service Ports
TENANT_SERVICE_PORT=8201
WAREHOUSE_SERVICE_PORT=8202
MARKETPLACE_SERVICE_PORT=8203
PROCUREMENT_SERVICE_PORT=8204

# Backup Configuration
BACKUP_DIR=/mnt/backups/kartezy
BACKUP_RETENTION_DAYS=30
ENCRYPTION_KEY=generate_a_256bit_key
S3_BUCKET=kartezy-backups
```

## Quick Start

```bash
# 1. Apply enterprise database schema
psql -h localhost -U kartezy -d kartezy -f database/postgres/enterprise-schema.sql

# 2. Start enterprise services
docker compose -f devops/docker/docker-compose.yml -f devops/docker/enterprise-docker-compose.yml up -d

# 3. Verify deployment
bash scripts/enterprise-health-check.sh

# 4. Configure backup cron
crontab -e
# Add: 0 */6 * * * /path/to/scripts/enterprise-backup.sh
```
