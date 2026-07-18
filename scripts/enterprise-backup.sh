#!/bin/bash
# ============================================================
# Kartezy Enterprise Backup Script
# Multi-region backup with encryption, verification, and rotation
# ============================================================

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/mnt/backups/kartezy}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
R2R_DAYS="${R2R_DAYS:-7}"  # Weekly restore test
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="kartezy_backup_${TIMESTAMP}"
ENCRYPTION_KEY="${ENCRYPTION_KEY:-}"
S3_BUCKET="${S3_BUCKET:-kartezy-backups}"
S3_REGION="${S3_REGION:-ap-south-1}"
SLACK_WEBHOOK="${SLACK_WEBHOOK_URL:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Validate configuration
validate_config() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log_info "Created backup directory: $BACKUP_DIR"
    fi

    if [ -z "${POSTGRES_PASSWORD:-}" ]; then
        log_error "POSTGRES_PASSWORD not set"
        exit 1
    fi
}

# PostgreSQL backup with parallel dump
backup_postgresql() {
    log_info "Starting PostgreSQL backup..."

    local PG_HOST="${POSTGRES_HOST:-localhost}"
    local PG_PORT="${POSTGRES_PORT:-5432}"
    local PG_DB="${POSTGRES_DB:-kartezy}"
    local PG_USER="${POSTGRES_USER:-kartezy}"

    # Parallel dump using 4 jobs
    PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
        -h "$PG_HOST" \
        -p "$PG_PORT" \
        -U "$PG_USER" \
        -d "$PG_DB" \
        -j 4 \
        -F directory \
        --no-owner \
        --no-acl \
        --verbose \
        -f "${BACKUP_DIR}/${BACKUP_NAME}/postgres" 2>&1 | tail -5

    log_info "PostgreSQL backup completed"
}

# PostgreSQL global objects backup (roles, tablespaces)
backup_postgresql_global() {
    log_info "Starting PostgreSQL global objects backup..."

    local PG_HOST="${POSTGRES_HOST:-localhost}"
    local PG_PORT="${POSTGRES_PORT:-5432}"
    local PG_USER="${POSTGRES_USER:-kartezy}"

    PGPASSWORD="$POSTGRES_PASSWORD" pg_dumpall \
        -h "$PG_HOST" \
        -p "$PG_PORT" \
        -U "$PG_USER" \
        --globals-only \
        -f "${BACKUP_DIR}/${BACKUP_NAME}/postgres_globals.sql" 2>&1 | tail -3

    log_info "PostgreSQL global backup completed"
}

# MongoDB backup
backup_mongodb() {
    log_info "Starting MongoDB backup..."

    local MONGO_HOST="${MONGO_HOST:-localhost}"
    local MONGO_PORT="${MONGO_PORT:-27017}"

    if [ -n "${MONGODB_PASSWORD:-}" ]; then
        mongodump \
            --host "$MONGO_HOST" \
            --port "$MONGO_PORT" \
            --username "${MONGODB_USER:-kartezy}" \
            --password "$MONGODB_PASSWORD" \
            --authenticationDatabase admin \
            --db kartezy \
            --out "${BACKUP_DIR}/${BACKUP_NAME}/mongodb" \
            --gzip \
            --verbose 2>&1 | tail -5
    else
        mongodump \
            --host "$MONGO_HOST" \
            --port "$MONGO_PORT" \
            --db kartezy \
            --out "${BACKUP_DIR}/${BACKUP_NAME}/mongodb" \
            --gzip \
            --verbose 2>&1 | tail -5
    fi

    log_info "MongoDB backup completed"
}

# Redis backup (RDB snapshot)
backup_redis() {
    log_info "Starting Redis backup..."

    local REDIS_HOST="${REDIS_HOST:-localhost}"
    local REDIS_PORT="${REDIS_PORT:-6379}"

    # Trigger SAVE
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" SAVE

    # Copy dump file
    cp "/var/lib/redis/dump.rdb" "${BACKUP_DIR}/${BACKUP_NAME}/redis_dump.rdb" 2>/dev/null || \
        log_warn "Redis dump not found at /var/lib/redis/dump.rdb"

    log_info "Redis backup completed"
}

# Elasticsearch snapshot backup
backup_elasticsearch() {
    log_info "Starting Elasticsearch backup..."

    local ES_HOST="${ELASTICSEARCH_HOST:-localhost}"
    local ES_PORT="${ELASTICSEARCH_PORT:-9200}"

    # Create snapshot repository
    curl -s -X PUT "http://${ES_HOST}:${ES_PORT}/_snapshot/kartezy_backups" \
        -H 'Content-Type: application/json' \
        -d "{
            \"type\": \"fs\",
            \"settings\": {
                \"location\": \"${BACKUP_DIR}/${BACKUP_NAME}/elasticsearch\"
            }
        }" > /dev/null

    # Create snapshot
    curl -s -X PUT "http://${ES_HOST}:${ES_PORT}/_snapshot/kartezy_backups/snapshot_${TIMESTAMP}" \
        -H 'Content-Type: application/json' \
        -d '{
            "indices": "kartezy_*",
            "include_global_state": true
        }' > /dev/null

    log_info "Elasticsearch backup completed"
}

# Encrypt backup
encrypt_backup() {
    if [ -n "$ENCRYPTION_KEY" ]; then
        log_info "Encrypting backup..."
        tar czf - -C "$BACKUP_DIR" "${BACKUP_NAME}" | \
            openssl enc -aes-256-cbc -salt -pass "pass:${ENCRYPTION_KEY}" \
            -out "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc"
        rm -rf "${BACKUP_DIR:?}/${BACKUP_NAME}"
        log_info "Backup encrypted: ${BACKUP_NAME}.tar.gz.enc"
    else
        log_warn "No encryption key set - skipping encryption"
        tar czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" -C "$BACKUP_DIR" "${BACKUP_NAME}"
        rm -rf "${BACKUP_DIR:?}/${BACKUP_NAME}"
    fi
}

# Upload to S3 (optional)
upload_to_s3() {
    if [ -n "${AWS_ACCESS_KEY_ID:-}" ] && [ -n "${AWS_SECRET_ACCESS_KEY:-}" ]; then
        log_info "Uploading backup to S3..."

        aws s3 cp \
            "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc" \
            "s3://${S3_BUCKET}/backups/${BACKUP_NAME}.tar.gz.enc" \
            --region "$S3_REGION" \
            --storage-class STANDARD_IA

        # Copy to secondary region for DR
        for region in "${S3_REPLICA_REGIONS[@]:-}"; do
            if [ -n "$region" ]; then
                aws s3 cp \
                    "s3://${S3_BUCKET}/backups/${BACKUP_NAME}.tar.gz.enc" \
                    "s3://${S3_BUCKET}-${region}/backups/${BACKUP_NAME}.tar.gz.enc" \
                    --region "$region" &
            fi
        done
        wait

        log_info "S3 upload completed"
    else
        log_info "AWS credentials not configured - skipping S3 upload"
    fi
}

# Verify backup integrity
verify_backup() {
    log_info "Verifying backup integrity..."

    local BACKUP_FILE="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc"
    if [ -n "$ENCRYPTION_KEY" ]; then
        # Verify encryption
        openssl enc -d -aes-256-cbc -salt -pass "pass:${ENCRYPTION_KEY}" \
            -in "$BACKUP_FILE" -out /dev/null 2>&1 && \
            log_info "Encryption verification: PASSED" || \
            log_error "Encryption verification: FAILED"
    else
        # Verify archive
        tar tzf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" > /dev/null && \
            log_info "Archive verification: PASSED" || \
            log_error "Archive verification: FAILED"
    fi
}

# Rotate old backups
rotate_backups() {
    log_info "Rotating backups older than $RETENTION_DAYS days..."

    find "$BACKUP_DIR" -name "kartezy_backup_*.tar.gz*" -type f -mtime +$RETENTION_DAYS -delete
    log_info "Backup rotation completed"
}

# Calculate and log backup size
log_backup_stats() {
    local BACKUP_FILE="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc"
    if [ ! -f "$BACKUP_FILE" ]; then
        BACKUP_FILE="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
    fi

    local SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    local CHECKSUM=$(sha256sum "$BACKUP_FILE" | cut -d' ' -f1)

    log_info "Backup size: $SIZE"
    log_info "Backup checksum: $CHECKSUM"

    # Log backup manifest
    cat > "${BACKUP_DIR}/${BACKUP_NAME}.manifest.json" <<EOF
{
    "backup_name": "${BACKUP_NAME}",
    "timestamp": "$(date -Iseconds)",
    "size": "${SIZE}",
    "checksum": "${CHECKSUM}",
    "components": ["postgresql", "mongodb", "redis", "elasticsearch"],
    "retention_days": ${RETENTION_DAYS}
}
EOF
}

# Send notification
send_notification() {
    local STATUS="$1"
    local MESSAGE="$2"

    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -s -X POST "$SLACK_WEBHOOK" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\": \"Kartezy Backup *${STATUS}*: ${MESSAGE}\"
            }" > /dev/null
    fi
}

# Main execution
main() {
    log_info "============================================"
    log_info "Kartezy Enterprise Backup - ${TIMESTAMP}"
    log_info "============================================"

    validate_config

    # Create backup directory
    mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"

    # Perform backups
    backup_postgresql
    backup_postgresql_global
    backup_mongodb
    backup_redis
    backup_elasticsearch

    # Post-processing
    encrypt_backup
    upload_to_s3
    verify_backup
    rotate_backups
    log_backup_stats

    log_info "============================================"
    log_info "Backup completed successfully!"
    log_info "============================================"

    send_notification "SUCCESS" "Backup ${BACKUP_NAME} completed successfully"
}

# Execute with error handling
if main 2>&1 | tee -a "${BACKUP_DIR}/backup_${TIMESTAMP}.log"; then
    log_info "Backup process finished successfully"
else
    log_error "Backup process failed"
    send_notification "FAILED" "Backup process failed. Check logs."
    exit 1
fi
