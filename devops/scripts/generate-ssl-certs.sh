#!/bin/bash
# Generate self-signed SSL certificates for development
# In production, replace with Let's Encrypt or trusted CA certificates

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SSL_DIR="$SCRIPT_DIR/../nginx/ssl"

mkdir -p "$SSL_DIR"

# Generate a self-signed certificate valid for 365 days
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SSL_DIR/privkey.pem" \
    -out "$SSL_DIR/fullchain.pem" \
    -subj "/C=US/ST=State/L=City/O=Kartezy/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,DNS:api.kartezy.com,IP:127.0.0.1"

echo "Self-signed SSL certificates generated at: $SSL_DIR"
echo "  - $SSL_DIR/fullchain.pem"
echo "  - $SSL_DIR/privkey.pem"
echo ""
echo "For production: Replace with Let's Encrypt certificates"
