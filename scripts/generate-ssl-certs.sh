#!/bin/bash
# ============================================================
# Kartezy SSL Certificate Generation Script
# ============================================================
# For development: generates self-signed certificates
# For production: use Let's Encrypt (certbot)
# ============================================================

set -euo pipefail

DOMAIN="${1:-kartezy.local}"
SSL_DIR="../devops/nginx/ssl"
DAYS_VALID=${DAYS_VALID:-365}

mkdir -p "${SSL_DIR}"

echo "==========================================="
echo " SSL Certificate Generation for ${DOMAIN}"
echo "==========================================="
echo ""

if [ -f "${SSL_DIR}/fullchain.pem" ] && [ -f "${SSL_DIR}/privkey.pem" ]; then
    echo "Existing certificates found. Checking expiry..."
    openssl x509 -checkend $((DAYS_VALID * 86400)) -in "${SSL_DIR}/fullchain.pem" && {
        echo "Certificates are still valid."
        echo "To force regeneration, delete: ${SSL_DIR}/fullchain.pem"
        exit 0
    } || {
        echo "Certificates expired or expiring soon. Regenerating..."
    }
fi

# Generate self-signed certificate for development
echo "Generating self-signed certificate for ${DOMAIN}..."

openssl req -x509 \
    -newkey rsa:4096 \
    -keyout "${SSL_DIR}/privkey.pem" \
    -out "${SSL_DIR}/fullchain.pem" \
    -days "${DAYS_VALID}" \
    -nodes \
    -subj "/C=IN/ST=KA/L=Bangalore/O=Kartezy/CN=${DOMAIN}" \
    -addext "subjectAltName=DNS:${DOMAIN},DNS:*.${DOMAIN},DNS:localhost"

# Set proper permissions
chmod 600 "${SSL_DIR}/privkey.pem"
chmod 644 "${SSL_DIR}/fullchain.pem"

echo ""
echo "==========================================="
echo " Certificates Generated!"
echo "==========================================="
echo " Certificate: ${SSL_DIR}/fullchain.pem"
echo " Private Key: ${SSL_DIR}/privkey.pem"
echo " Domain:      ${DOMAIN}"
echo " Days Valid:  ${DAYS_VALID}"
echo ""
echo "For production, use Let's Encrypt:"
echo "  sudo certbot certonly --standalone -d ${DOMAIN}"
echo "  sudo cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ${SSL_DIR}/"
echo "  sudo cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ${SSL_DIR}/"
echo "==========================================="
