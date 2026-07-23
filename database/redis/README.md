# Redis Configuration

## Version
Redis 7.x (Alpine-based Docker image)

## Purpose
- Session management (user/auth sessions)
- Distributed caching (product catalog, store listings)
- Rate limiting counters
- Real-time data (WebSocket presence, location caching)

## Configuration
```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 3s
    retries: 5
```

## Environment Variables
- `REDIS_HOST` - Redis server hostname
- `REDIS_PORT` - Redis server port (default: 6379)
- `REDIS_PASSWORD` - Redis authentication password
