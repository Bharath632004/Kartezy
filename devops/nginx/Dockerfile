# ============================================================
# Kartezy NGINX Reverse Proxy - Production Image
# ============================================================

FROM nginx:1.26-alpine

# Install tools for health checks and certbot
RUN apk add --no-cache curl certbot

# Remove default nginx configuration
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create required directories
RUN mkdir -p /etc/nginx/ssl \
             /var/www/certbot \
             /var/log/nginx

# Create non-root nginx user
RUN adduser -D -u 1001 -g 'nginx' nginx

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx \
                         /var/log/nginx \
                         /etc/nginx/ssl \
                         /var/www/certbot

# Security hardening
RUN chmod 640 /etc/nginx/nginx.conf && \
    chmod 750 /etc/nginx/ssl

USER nginx

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
