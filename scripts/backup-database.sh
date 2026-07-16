#!/bin/bash
# ============================================================
# Kartezy Database Backup Script
# ============================================================
# Supports: PostgreSQL, MongoDB, Redis, Elasticsearch
# Usage: ./backup-database.sh [backup-dir]
# ============================================================

set -euo pipefail

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/${TIMESTAMP}"
RETENTION_DAYS=${RETENTION_DAYS:-30}
LOG_FILE="${BACKUP_DIR}/backup-${TIMESTAMP}.log"

# Load environment variables from .env if present
if [ -f ../devops/docker/.env ]; then
    set -a
    source ../devops/docker/.env
    set +a
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

mkdir -p "${BACKUP_PATH}"

log() {
    echo -e "[$(date +%H:%M:%S)] $1" | tee -a "${LOG_FILE}"
}

log_success() {
    log "${GREEN}✓${NC} $1"
}

log_error() {
    log "${RED}✗${NC} $1"
}

log_warning() {
    log "${YELLOW}⚠${NC} $1"
}

# ============================================================
# 1. PostgreSQL Backup
# ============================================================
backup_postgres() {
    log "Starting PostgreSQL backup..."

    if command -v pg_dump &> /dev/null; then
        pg_dump -h "${POSTGRES_HOST:-localhost}" \
                -p "${POSTGRES_PORT:-5432}" \
                -U "${POSTGRES_USER:-kartezy}" \
                -d "${POSTGRES_DB:-kartezy}" \
                -F c \
                -f "${BACKUP_PATH}/postgres_${TIMESTAMP}.dump" 2>> "${LOG_FILE}"

        # Also dump plain SQL for easy restoration
        pg_dump -h "${POSTGRES_HOST:-localhost}" \
                -p "${POSTGRES_PORT:-5432}" \
                -U "${POSTGRES_USER:-kartezy}" \
                -d "${POSTGRES_DB:-kartezy}" \
                --create \
                --clean \
                -f "${BACKUP_PATH}/postgres_${TIMESTAMP}.sql" 2>> "${LOG_FILE}"

        # Compress SQL dump
        gzip -f "${BACKUP_PATH}/postgres_${TIMESTAMP}.sql"

        log_success "PostgreSQL backup completed"
    else
        log_warning "pg_dump not found. Skipping PostgreSQL backup."
    fi
}

# ============================================================
# 2. MongoDB Backup
# ============================================================
backup_mongodb() {
    log "Starting MongoDB backup..."

    if command -v mongodump &> /dev/null; then
        mongodump --host "${MONGODB_HOST:-localhost}" \
                  --port "${MONGODB_PORT:-27017}" \
                  --username "${MONGODB_USER:-kartezy}" \
                  --password "${MONGODB_PASSWORD}" \
                  --db "${MONGODB_DB:-kartezy}" \
                  --out "${BACKUP_PATH}/mongodb_${TIMESTAMP}" 2>> "${LOG_FILE}"

        # Compress backup
        tar -czf "${BACKUP_PATH}/mongodb_${TIMESTAMP}.tar.gz" \
            -C "${BACKUP_PATH}" "mongodb_${TIMESTAMP}"
        rm -rf "${BACKUP_PATH}/mongodb_${TIMESTAMP}"

        log_success "MongoDB backup completed"
    else
        log_warning "mongodump not found. Skipping MongoDB backup."
    fi
}

# ============================================================
# 3. Redis Backup
# ============================================================
backup_redis() {
    log "Starting Redis backup..."

    if command -v redis-cli &> /dev/null; then
        redis-cli -h "${REDIS_HOST:-localhost}" \
                  -p "${REDIS_PORT:-6379}" \
                  --rdb "${BACKUP_PATH}/redis_${TIMESTAMP}.rdb" 2>> "${LOG_FILE}"

        log_success "Redis backup completed"
    else
        log_warning "redis-cli not found. Skipping Redis backup."
    fi
}

# ============================================================
# 4. Elasticsearch Backup (Snapshot via API)
# ============================================================
backup_elasticsearch() {
    log "Starting Elasticsearch backup..."

    # Create repository and snapshot using Elasticsearch snapshot API
    ES_HOST="${ELASTICSEARCH_HOST:-localhost}:${ELASTICSEARCH_PORT:-9200}"

    # Register snapshot repository
    curl -s -X PUT "http://${ES_HOST}/_snapshot/kartezy_backup" \
         -H 'Content-Type: application/json' \
         -d "{
           \"type\": \"fs\",
           \"settings\": {
             \"location\": \"${BACKUP_PATH}/elasticsearch\",
             \"compress\": true
           }
         }" 2>> "${LOG_FILE}" || log_warning "Failed to register Elasticsearch snapshot repository"

    # Create snapshot
    curl -s -X PUT "http://${ES_HOST}/_snapshot/kartezy_backup/snapshot_${TIMESTAMP}?wait_for_completion=true" \
         2>> "${LOG_FILE}" || log_warning "Elasticsearch snapshot may not have completed"

    log_success "Elasticsearch backup completed"
}

# ============================================================
# 5. Configuration Backup
# ============================================================
backup_configs() {
    log "Starting configuration backup..."

    # Backup config-repo
    if [ -d "../config-repo" ]; then
        tar -czf "${BACKUP_PATH}/config-repo_${TIMESTAMP}.tar.gz" \
            -C .. config-repo/
        log_success "Configuration repository backed up"
    fi

    # Backup Kubernetes manifests
    if [ -d "../devops/kubernetes" ]; then
        tar -czf "${BACKUP_PATH}/kubernetes-manifests_${TIMESTAMP}.tar.gz" \
            -C ../devops kubernetes/
        log_success "Kubernetes manifests backed up"
    fi

    # Backup devops/docker configurations
    if [ -f "../devops/docker/.env" ]; then
        cp "../devops/docker/.env" "${BACKUP_PATH}/docker-env_${TIMESTAMP}.bak"
        log_success "Docker environment backed up"
    fi
}

# ============================================================
# 6. Cleanup old backups
# ============================================================
cleanup_old_backups() {
    log "Cleaning up backups older than ${RETENTION_DAYS} days..."

    find "${BACKUP_DIR}" -maxdepth 1 -type d -mtime "+${RETENTION_DAYS}" \
         -exec rm -rf {} \; 2>/dev/null || true

    find "${BACKUP_DIR}" -maxdepth 1 -type f -name "*.tar.gz" \
         -mtime "+${RETENTION_DAYS}" -delete 2>/dev/null || true

    find "${BACKUP_DIR}" -maxdepth 1 -type f -name "*.dump" \
         -mtime "+${RETENTION_DAYS}" -delete 2>/dev/null || true

    log_success "Old backups cleaned"
}

# ============================================================
# Main
# ============================================================
main() {
    echo "==========================================="
    echo " Kartezy Database Backup - ${TIMESTAMP}"
    echo "==========================================="
    echo "Backup directory: ${BACKUP_PATH}"
    echo ""

    backup_postgres
    echo ""
    backup_mongodb
    echo ""
    backup_redis
    echo ""
    backup_elasticsearch
    echo ""
    backup_configs
    echo ""
    cleanup_old_backups

    # Create backup manifest
    cat > "${BACKUP_PATH}/manifest.json" <<EOF
{
    "timestamp": "${TIMESTAMP}",
    "project": "kartezy",
    "backup_type": "full",
    "components": {
        "postgresql": true,
        "mongodb": true,
        "redis": true,
        "elasticsearch": true,
        "configs": true
    },
    "retention_days": ${RETENTION_DAYS}
}
EOF

    echo ""
    log_success "All backups completed successfully!"
    echo "Backup location: ${BACKUP_PATH}"
    echo "Log file: ${LOG_FILE}"
}

main
