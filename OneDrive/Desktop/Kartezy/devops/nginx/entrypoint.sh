#!/bin/sh
set -e

# Substitute environment variables in nginx config template
# envsubst replaces ${VAR} patterns - escape dollar signs in regex patterns
envsubst '${NGINX_HOST}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Check if SSL certificates exist
if [ -f /etc/nginx/ssl/fullchain.pem ] && [ -f /etc/nginx/ssl/privkey.pem ]; then
    echo "SSL certificates found. Starting with HTTPS support."
else
    echo "WARNING: SSL certificates not found at /etc/nginx/ssl/"
    echo "  Generate self-signed certs: bash devops/scripts/generate-ssl-certs.sh"
    echo "Starting in HTTP-only mode. Disabling SSL server block."

    # Disable SSL server block - use broad patterns to handle any whitespace
    sed -i 's/^.*listen 443 ssl.*/#&/' /etc/nginx/conf.d/default.conf
    sed -i 's/^.*ssl_certificate .*/#&/' /etc/nginx/conf.d/default.conf
    sed -i 's/^.*ssl_certificate_key .*/#&/' /etc/nginx/conf.d/default.conf
    # Keep HTTP server as default by removing HTTPS redirect
    sed -i 's/^.*return 301 https.*$/#&/' /etc/nginx/conf.d/default.conf
fi

# Start nginx in the foreground
exec nginx -g 'daemon off;'
