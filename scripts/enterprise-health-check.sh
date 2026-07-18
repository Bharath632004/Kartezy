#!/bin/bash
# ============================================================
# Kartezy Enterprise Health Check
# Comprehensive health verification for all enterprise services
# ============================================================

set -euo pipefail

# Configuration
API_BASE="${API_BASE:-http://localhost:8080}"
TIMEOUT="${TIMEOUT:-10}"
SLACK_WEBHOOK="${SLACK_WEBHOOK_URL:-}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

PASS=0
FAIL=0
WARN=0

log_header() { echo -e "\n${CYAN}${BOLD}$1${NC}\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }
log_pass() { echo -e "  ${GREEN}✓${NC} $1"; ((PASS++)); }
log_fail() { echo -e "  ${RED}✗${NC} $1"; ((FAIL++)); }
log_warn() { echo -e "  ${YELLOW}⚠${NC} $1"; ((WARN++)); }

check_endpoint() {
    local NAME="$1"
    local URL="$2"
    local EXPECTED="${3:-200}"

    local HTTP_CODE
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$URL" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "$EXPECTED" ]; then
        log_pass "$NAME ($HTTP_CODE)"
    elif [ "$HTTP_CODE" = "000" ]; then
        log_fail "$NAME - Connection refused"
    else
        log_warn "$NAME - Expected $EXPECTED, got $HTTP_CODE"
    fi
}

check_service() {
    check_endpoint "$1 - Health" "${API_BASE}/api/$2/actuator/health" 200
    check_endpoint "$1 - Liveness" "${API_BASE}/api/$2/actuator/health/liveness" 200
    check_endpoint "$1 - Readiness" "${API_BASE}/api/$2/actuator/health/readiness" 200
}

echo -e "${CYAN}${BOLD}"
echo "╔══════════════════════════════════════════════════════╗"
echo "║         Kartezy Enterprise Health Check             ║"
echo "╚══════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo "API Base: $API_BASE"
echo "Started: $(date)"
echo ""

# ============================================================
# Core Infrastructure
# ============================================================
log_header "Core Infrastructure"

check_endpoint "API Gateway" "${API_BASE}/actuator/health"
check_endpoint "Eureka Discovery" "${API_BASE}/eureka/apps"
check_endpoint "Config Server" "${API_BASE}/config/health"

# ============================================================
# Business Services
# ============================================================
log_header "Business Services"

for service in auth users merchants catalog inventory orders payments delivery notifications wallet reviews; do
    check_service "${service^}" "$service"
done

# ============================================================
# AI/ML Services
# ============================================================
log_header "AI/ML Services"

for service in recommendations analytics ai forecasting chatbot search fraud; do
    check_service "${service^}" "$service"
done

# ============================================================
# Enterprise Services
# ============================================================
log_header "Enterprise Services"

check_service "Tenant" "enterprise/tenants"
check_service "Warehouse" "enterprise/warehouses"
check_service "Marketplace" "enterprise/vendors"
check_service "Procurement" "enterprise/procurement"

# ============================================================
# Database Connectivity
# ============================================================
log_header "Database Connectivity"

check_endpoint "PostgreSQL" "${API_BASE}/api/health/db/postgresql" 200
check_endpoint "MongoDB" "${API_BASE}/api/health/db/mongodb" 200
check_endpoint "Redis" "${API_BASE}/api/health/db/redis" 200
check_endpoint "Elasticsearch" "${API_BASE}/api/health/db/elasticsearch" 200
check_endpoint "Kafka" "${API_BASE}/api/health/messaging/kafka" 200

# ============================================================
# Multi-Tenant Specific Checks
# ============================================================
log_header "Multi-Tenant Checks"

# Check tenant resolution
TENANT_RESPONSE=$(curl -s -H "X-Tenant-Id: default" --max-time "$TIMEOUT" "${API_BASE}/api/enterprise/tenants/default" 2>/dev/null || echo "{}")
if echo "$TENANT_RESPONSE" | grep -q '"tenantId"'; then
    log_pass "Tenant resolution working"
else
    log_fail "Tenant resolution failed"
fi

# ============================================================
# Geo-Replication Status
# ============================================================
log_header "Geo-Replication Status"

if curl -s --max-time "$TIMEOUT" "${API_BASE}/api/health/geo/regions" > /dev/null 2>&1; then
    REGIONS=$(curl -s --max-time "$TIMEOUT" "${API_BASE}/api/health/geo/regions")
    REGION_COUNT=$(echo "$REGIONS" | grep -o '"regionCode"' | wc -l)
    log_pass "Geo-replication active: $REGION_COUNT regions"
else
    log_warn "Geo-replication not configured"
fi

# ============================================================
# Exchange Rate Status
# ============================================================
log_header "Exchange Rate Status"

if curl -s --max-time "$TIMEOUT" "${API_BASE}/api/health/currency/rates" > /dev/null 2>&1; then
    log_pass "Exchange rate service active"
else
    log_warn "Exchange rate service not available"
fi

# ============================================================
# Summary
# ============================================================
echo -e "\n${CYAN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}${BOLD}  Health Check Summary${NC}"
echo -e "${CYAN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}Passed:${NC} $PASS"
echo -e "  ${YELLOW}Warnings:${NC} $WARN"
echo -e "  ${RED}Failed:${NC} $FAIL"

TOTAL=$((PASS + FAIL + WARN))
echo -e "  ${BOLD}Total:${NC} $TOTAL"

if [ $FAIL -gt 0 ]; then
    echo -e "\n  ${RED}${BOLD}➜ Some checks failed! Review logs for details.${NC}"
    exit 1
elif [ $WARN -gt 0 ]; then
    echo -e "\n  ${YELLOW}${BOLD}➜ All critical checks passed with warnings.${NC}"
    exit 0
else
    echo -e "\n  ${GREEN}${BOLD}➜ All checks passed! System is healthy.${NC}"
    exit 0
fi
