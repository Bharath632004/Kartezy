#!/bin/bash
set -euo pipefail

# Kartezy Backup Script
# Supports: PostgreSQL, MongoDB, Redis, Config, Media

BACKUP_DIR=${BACKUP_DIR:-/backups}
RETENTION_DAYS=${RETENTION_DAYS:-30}
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${BACKUP_DIR}/backup_${DATE}.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"; }

mkdir -p "${BACKUP_DIR}"

# PostgreSQL Backup
backup_postgres() {
    log "Starting PostgreSQL backup..."
    PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
        -h "${POSTGRES_HOST:-postgres}" \
        -U "${POSTGRES_USER:-kartezy}" \
        -d "${POSTGRES_DB:-kartezy}" \
        --format=custom \
        --compress=9 \
        --file="${BACKUP_DIR}/postgres_${DATE}.dump" \
        2>>"$LOG_FILE"
    log "PostgreSQL backup completed: postgres_${DATE}.dump"
}

# MongoDB Backup
backup_mongodb() {
    log "Starting MongoDB backup..."
    mongodump \
        --host="${MONGODB_HOST:-mongodb}" \
        --username="${MONGODB_USER:-kartezy}" \
        --password="${MONGODB_PASSWORD}" \
        --authenticationDatabase=admin \
        --db="${MONGODB_DB:-kartezy}" \
        --out="${BACKUP_DIR}/mongodb_${DATE}" \
        --gzip \
        2>>"$LOG_FILE"
    tar -czf "${BACKUP_DIR}/mongodb_${DATE}.tar.gz" -C "${BACKUP_DIR}" "mongodb_${DATE}" 2>>"$LOG_FILE"
    rm -rf "${BACKUP_DIR}/mongodb_${DATE}"
    log "MongoDB backup completed: mongodb_${DATE}.tar.gz"
}

# Redis Backup (RDB)
backup_redis() {
    log "Starting Redis backup..."
    redis-cli -h "${REDIS_HOST:-redis}" -p "${REDIS_PORT:-6379}" \
        --rdb "${BACKUP_DIR}/redis_${DATE}.rdb" \
        2>>"$LOG_FILE"
    log "Redis backup completed: redis_${DATE}.rdb"
}

# Configuration Backup
backup_config() {
    log "Starting config backup..."
    tar -czf "${BACKUP_DIR}/config_${DATE}.tar.gz" \
        -C / config-repo \
        -C / devops/docker/.env \
        2>/dev/null || true
    log "Config backup completed: config_${DATE}.tar.gz"
}

# Media/Uploads Backup
backup_media() {
    log "Starting media backup..."
    if [ -d "/media" ]; then
        tar -czf "${BACKUP_DIR}/media_${DATE}.tar.gz" -C / media 2>>"$LOG_FILE"
        log "Media backup completed: media_${DATE}.tar.gz"
    else
        log "Media directory not found, skipping..."
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up backups older than ${RETENTION_DAYS} days..."
    find "${BACKUP_DIR}" -name "*.dump" -type f -mtime "+${RETENTION_DAYS}" -delete
    find "${BACKUP_DIR}" -name "*.tar.gz" -type f -mtime "+${RETENTION_DAYS}" -delete
    find "${BACKUP_DIR}" -name "*.rdb" -type f -mtime "+${RETENTION_DAYS}" -delete
    find "${BACKUP_DIR}" -name "*.log" -type f -mtime "+${RETENTION_DAYS}" -delete
    log "Cleanup completed"
}

# Restore Verification
verify_backups() {
    log "Verifying backup integrity..."
    for f in "${BACKUP_DIR}"/*.dump; do
        if [ -f "$f" ]; then
            pg_restore --list "$f" >/dev/null 2>>"$LOG_FILE" && \
                log "Verified: $(basename "$f")" || \
                log "CORRUPT: $(basename "$f")"
        fi
    done
    for f in "${BACKUP_DIR}"/*.tar.gz; do
        if [ -f "$f" ]; then
            tar -tzf "$f" >/dev/null 2>>"$LOG_FILE" && \
                log "Verified: $(basename "$f")" || \
                log "CORRUPT: $(basename "$f")"
        fi
    done
}

# Main
case "${1:-all}" in
    postgres)  backup_postgres ;;
    mongodb)   backup_mongodb ;;
    redis)     backup_redis ;;
    config)    backup_config ;;
    media)     backup_media ;;
    verify)    verify_backups ;;
    all)
        backup_postgres
        backup_mongodb
        backup_redis
        backup_config
        backup_media
        cleanup_old_backups
        verify_backups
        log "Full backup cycle completed successfully"
        ;;
    *)
        echo "Usage: $0 {postgres|mongodb|redis|config|media|verify|all}"
        exit 1
        ;;
esac
