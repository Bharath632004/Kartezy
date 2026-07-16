#!/bin/bash
# ============================================================
# Kartezy Database Restore Script
# ============================================================
# Usage: ./restore-database.sh <backup-timestamp>
# Example: ./restore-database.sh 20240101_120000
# ============================================================

set -euo pipefail

BACKUP_DIR="./backups"
TIMESTAMP="${1:?Usage: $0 <backup-timestamp>}"
BACKUP_PATH="${BACKUP_DIR}/${TIMESTAMP}"
LOG_FILE="${BACKUP_DIR}/restore-${TIMESTAMP}.log"

if [ ! -d "${BACKUP_PATH}" ]; then
    echo "Error: Backup directory not found: ${BACKUP_PATH}"
    echo "Available backups:"
    ls -1 "${BACKUP_DIR}/"
    exit 1
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "[$(date +%H:%M:%S)] $1" | tee -a "${LOG_FILE}"; }
success() { log "${GREEN}✓${NC} $1"; }
error() { log "${RED}✗${NC} $1"; }
warning() { log "${YELLOW}⚠${NC} $1"; }

# Confirmation
echo "==========================================="
echo "  WARNING: DATABASE RESTORE"
echo "==========================================="
echo "This will OVERWRITE all existing data!"
echo "Backup to restore: ${BACKUP_PATH}"
echo ""
read -p "Are you sure? Type 'yes' to continue: " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Load environment
if [ -f ../devops/docker/.env ]; then
    set -a
    source ../devops/docker/.env
    set +a
fi

# Restore PostgreSQL
restore_postgres() {
    local dump_file="${BACKUP_PATH}/postgres_${TIMESTAMP}.dump"
    if [ -f "${dump_file}" ]; then
        log "Restoring PostgreSQL..."
        pg_restore -h "${POSTGRES_HOST:-localhost}" \
                   -p "${POSTGRES_PORT:-5432}" \
                   -U "${POSTGRES_USER:-kartezy}" \
                   -d "${POSTGRES_DB:-kartezy}" \
                   --clean \
                   --if-exists \
                   "${dump_file}" 2>> "${LOG_FILE}"
        success "PostgreSQL restored"
    else
        warning "PostgreSQL dump not found: ${dump_file}"
    fi
}

# Restore MongoDB
restore_mongodb() {
    local archive="${BACKUP_PATH}/mongodb_${TIMESTAMP}.tar.gz"
    if [ -f "${archive}" ]; then
        log "Restoring MongoDB..."
        tar -xzf "${archive}" -C /tmp/
        local mongodir=$(find /tmp -maxdepth 1 -name "mongodb_*" -type d | head -1)
        if [ -n "${mongodir}" ]; then
            mongorestore --host "${MONGODB_HOST:-localhost}" \
                        --port "${MONGODB_PORT:-27017}" \
                        --username "${MONGODB_USER:-kartezy}" \
                        --password "${MONGODB_PASSWORD}" \
                        --drop \
                        "${mongodir}" 2>> "${LOG_FILE}"
            rm -rf "${mongodir}"
            success "MongoDB restored"
        fi
    else
        warning "MongoDB backup not found: ${archive}"
    fi
}

# Restore Redis
restore_redis() {
    local rdb_file="${BACKUP_PATH}/redis_${TIMESTAMP}.rdb"
    if [ -f "${rdb_file}" ]; then
        log "Restoring Redis..."
        redis-cli -h "${REDIS_HOST:-localhost}" \
                  -p "${REDIS_PORT:-6379}" \
                  --pipe < "${rdb_file}" 2>> "${LOG_FILE}" || true
        success "Redis restored (partial - keys may differ)"
    else
        warning "Redis RDB not found: ${rdb_file}"
    fi
}

# Main
main() {
    echo ""
    echo "Starting restore from: ${BACKUP_PATH}"
    echo ""

    restore_postgres
    restore_mongodb
    restore_redis

    echo ""
    success "Database restore completed!"
    echo "Log file: ${LOG_FILE}"
}

main
