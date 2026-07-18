#!/bin/bash
# ============================================================
# Kartezy Enterprise Restore Script
# Point-in-time recovery with validation and rollback support
# ============================================================

set -euo pipefail

# Configuration
RESTORE_DIR="${RESTORE_DIR:-/mnt/backups/kartezy}"
ENCRYPTION_KEY="${ENCRYPTION_KEY:-}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Validate input
validate_input() {
    if [ $# -lt 1 ]; then
        echo "Usage: $0 <backup-name|latest> [components...]"
        echo "  backup-name: Name of the backup to restore"
        echo "  components: postgresql, mongodb, redis, elasticsearch (default: all)"
        echo ""
        echo "Examples:"
        echo "  $0 latest                     # Restore all from latest backup"
        echo "  $0 kartezy_backup_20240101_120000  # Restore specific backup"
        echo "  $0 latest postgresql          # Restore only PostgreSQL"
        exit 1
    fi
}

# Find the backup to restore
find_backup() {
    local BACKUP_NAME="$1"

    if [ "$BACKUP_NAME" = "latest" ]; then
        if [ -n "$ENCRYPTION_KEY" ]; then
            BACKUP_PATH=$(ls -t ${RESTORE_DIR}/kartezy_backup_*.tar.gz.enc 2>/dev/null | head -1)
        else
            BACKUP_PATH=$(ls -t ${RESTORE_DIR}/kartezy_backup_*.tar.gz 2>/dev/null | head -1)
        fi
    else
        if [ -n "$ENCRYPTION_KEY" ]; then
            BACKUP_PATH="${RESTORE_DIR}/${BACKUP_NAME}.tar.gz.enc"
        else
            BACKUP_PATH="${RESTORE_DIR}/${BACKUP_NAME}.tar.gz"
        fi
    fi

    if [ -z "$BACKUP_PATH" ] || [ ! -f "$BACKUP_PATH" ]; then
        log_error "Backup not found: $BACKUP_NAME"
        exit 1
    fi

    log_info "Found backup: $BACKUP_PATH"
}

# Extract backup
extract_backup() {
    local EXTRACT_DIR="${RESTORE_DIR}/extract_${TIMESTAMP}"
    mkdir -p "$EXTRACT_DIR"

    if [ -n "$ENCRYPTION_KEY" ]; then
        log_info "Decrypting backup..."
        openssl enc -d -aes-256-cbc -salt -pass "pass:${ENCRYPTION_KEY}" \
            -in "$BACKUP_PATH" | tar xzf - -C "$EXTRACT_DIR"
    else
        log_info "Extracting backup..."
        tar xzf "$BACKUP_PATH" -C "$EXTRACT_DIR"
    fi

    # Find the actual backup directory
    EXTRACTED_DIR=$(ls -d "$EXTRACT_DIR"/*/ 2>/dev/null | head -1)
    if [ -z "$EXTRACTED_DIR" ]; then
        log_error "Extraction failed - no directory found"
        exit 1
    fi

    echo "$EXTRACTED_DIR"
}

# Restore PostgreSQL
restore_postgresql() {
    local EXTRACTED_DIR="$1"

    if [ ! -d "${EXTRACTED_DIR}postgres" ]; then
        log_warn "PostgreSQL backup not found in this backup"
        return
    fi

    log_info "Restoring PostgreSQL..."

    local PG_HOST="${POSTGRES_HOST:-localhost}"
    local PG_PORT="${POSTGRES_PORT:-5432}"
    local PG_DB="${POSTGRES_DB:-kartezy}"
    local PG_USER="${POSTGRES_USER:-kartezy}"

    # Create a rollback savepoint
    log_info "Creating rollback point..."
    PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
        -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" \
        -F custom -f "${RESTORE_DIR}/rollback_${TIMESTAMP}.dump" \
        --no-owner --no-acl

    # Drop and recreate database
    PGPASSWORD="$POSTGRES_PASSWORD" psql \
        -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" \
        -d postgres \
        -c "DROP DATABASE IF EXISTS ${PG_DB}_restore;"
    PGPASSWORD="$POSTGRES_PASSWORD" createdb \
        -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" \
        "${PG_DB}_restore"

    # Restore from backup
    PGPASSWORD="$POSTGRES_PASSWORD" pg_restore \
        -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" \
        -d "${PG_DB}_restore" \
        -j 4 \
        --no-owner \
        --no-acl \
        --verbose \
        "${EXTRACTED_DIR}postgres" 2>&1 | tail -5

    # Verify restore
    local TABLE_COUNT=$(PGPASSWORD="$POSTGRES_PASSWORD" psql \
        -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" \
        -d "${PG_DB}_restore" \
        -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema');")
    TABLE_COUNT=$(echo "$TABLE_COUNT" | tr -d ' ')

    log_info "Restored database has $TABLE_COUNT tables"

    # Swap databases
    PGPASSWORD="$POSTGRES_PASSWORD" psql \
        -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" \
        -d postgres \
        -c "DROP DATABASE IF EXISTS ${PG_DB}_old;"
    PGPASSWORD="$POSTGRES_PASSWORD" psql \
        -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" \
        -d postgres \
        -c "ALTER DATABASE ${PG_DB} RENAME TO ${PG_DB}_old;"
    PGPASSWORD="$POSTGRES_PASSWORD" psql \
        -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" \
        -d postgres \
        -c "ALTER DATABASE ${PG_DB}_restore RENAME TO ${PG_DB};"

    log_info "PostgreSQL restore completed successfully"
}

# Restore MongoDB
restore_mongodb() {
    local EXTRACTED_DIR="$1"

    if [ ! -d "${EXTRACTED_DIR}mongodb" ]; then
        log_warn "MongoDB backup not found in this backup"
        return
    fi

    log_info "Restoring MongoDB..."

    local MONGO_HOST="${MONGO_HOST:-localhost}"
    local MONGO_PORT="${MONGO_PORT:-27017}"

    if [ -n "${MONGODB_PASSWORD:-}" ]; then
        mongorestore \
            --host "$MONGO_HOST" \
            --port "$MONGO_PORT" \
            --username "${MONGODB_USER:-kartezy}" \
            --password "$MONGODB_PASSWORD" \
            --authenticationDatabase admin \
            --drop \
            --gzip \
            --verbose \
            "${EXTRACTED_DIR}mongodb" 2>&1 | tail -5
    else
        mongorestore \
            --host "$MONGO_HOST" \
            --port "$MONGO_PORT" \
            --drop \
            --gzip \
            --verbose \
            "${EXTRACTED_DIR}mongodb" 2>&1 | tail -5
    fi

    log_info "MongoDB restore completed"
}

# Restore Redis
restore_redis() {
    local EXTRACTED_DIR="$1"

    if [ ! -f "${EXTRACTED_DIR}redis_dump.rdb" ]; then
        log_warn "Redis backup not found in this backup"
        return
    fi

    log_info "Restoring Redis..."

    local REDIS_HOST="${REDIS_HOST:-localhost}"
    local REDIS_PORT="${REDIS_PORT:-6379}"

    # Stop Redis and replace dump
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" SHUTDOWN NOSAVE || true
    cp "${EXTRACTED_DIR}redis_dump.rdb" /var/lib/redis/dump.rdb
    # Redis will auto-load on restart

    log_info "Redis restore completed (requires restart)"
}

# Verify restore
verify_restore() {
    log_info "Verifying restore..."

    # Check PostgreSQL connectivity
    local PG_HOST="${POSTGRES_HOST:-localhost}"
    local PG_PORT="${POSTGRES_PORT:-5432}"
    local PG_USER="${POSTGRES_USER:-kartezy}"

    PGPASSWORD="$POSTGRES_PASSWORD" psql \
        -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" \
        -d "${POSTGRES_DB:-kartezy}" \
        -c "SELECT 1 as connection_test;" > /dev/null 2>&1 && \
        log_info "PostgreSQL connection: OK" || \
        log_error "PostgreSQL connection: FAILED"

    # Check key tables
    for table in "kartezy_enterprise.tenants" "kartezy_enterprise.countries" "kartezy_enterprise.warehouses"; do
        PGPASSWORD="$POSTGRES_PASSWORD" psql \
            -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" \
            -d "${POSTGRES_DB:-kartezy}" \
            -c "SELECT count(*) FROM $table;" > /dev/null 2>&1 && \
            log_info "Table $table: OK" || \
            log_warn "Table $table: NOT FOUND"
    done

    log_info "Restore verification completed"
}

# Main execution
main() {
    validate_input "$@"

    local BACKUP_NAME="${1:-latest}"
    shift || true
    local COMPONENTS=("${@:-postgresql mongodb redis elasticsearch}")

    log_info "============================================"
    log_info "Kartezy Enterprise Restore - ${TIMESTAMP}"
    log_info "Backup: ${BACKUP_NAME}"
    log_info "Components: ${COMPONENTS[*]}"
    log_info "============================================"

    find_backup "$BACKUP_NAME"
    local EXTRACTED_DIR
    EXTRACTED_DIR=$(extract_backup)

    log_info "Extracted to: $EXTRACTED_DIR"

    # Restore components
    for component in "${COMPONENTS[@]}"; do
        case "$component" in
            postgresql)
                restore_postgresql "$EXTRACTED_DIR"
                ;;
            mongodb)
                restore_mongodb "$EXTRACTED_DIR"
                ;;
            redis)
                restore_redis "$EXTRACTED_DIR"
                ;;
            elasticsearch)
                log_warn "Elasticsearch restore not yet automated"
                ;;
            *)
                log_warn "Unknown component: $component"
                ;;
        esac
    done

    verify_restore

    # Cleanup
    rm -rf "$EXTRACTED_DIR"

    log_info "============================================"
    log_info "Restore completed successfully!"
    log_info "============================================"
}

main "$@"
