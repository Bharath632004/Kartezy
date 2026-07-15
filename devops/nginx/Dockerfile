FROM nginx:alpine

# Install envsubst for template variable substitution
RUN apk add --no-cache gettext

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy entrypoint script
COPY entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose ports
EXPOSE 80 443

# Use custom entrypoint that substitutes environment variables
ENTRYPOINT ["/docker-entrypoint.sh"]
