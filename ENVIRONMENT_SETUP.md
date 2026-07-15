# Environment Setup

## Prerequisites Installation

### Java 21
```bash
# Ubuntu/Debian
sudo apt install openjdk-21-jdk

# macOS
brew install openjdk@21

# Windows
# Download from https://adoptium.net/
```

### Node.js 20
```bash
# Using nvm
nvm install 20
nvm use 20

# Or download from https://nodejs.org/
```

### Flutter
```bash
# Follow instructions at https://docs.flutter.dev/get-started/install
flutter doctor
```

### Docker
```bash
# Docker Desktop
# Download from https://www.docker.com/products/docker-desktop/
```

## Environment Variables

### Root `.env`
```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=kartezy
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Elasticsearch
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PORT=9200

# JWT
JWT_SECRET=your-256-bit-secret-key-here
JWT_EXPIRATION_MS=86400000

# APIs
GOOGLE_MAPS_API_KEY=your-key-here
```

### Backend Configuration
Each Spring Boot service uses:
- `application.yml` (default)
- `application-dev.yml` (development overrides)
- `application-prod.yml` (production overrides)

## Docker Services

```bash
# Start all infrastructure
docker compose -f devops/docker/docker-compose.yml up -d

# View logs
docker compose -f devops/docker/docker-compose.yml logs -f

# Stop all
docker compose -f devops/docker/docker-compose.yml down
```

## IDE Setup

### IntelliJ IDEA
1. Open `backend/` as project root
2. Enable annotation processing for Lombok
3. Install Spring Boot plugin
4. Import `pom.xml` as Maven project

### VS Code
1. Install extensions:
   - Java Extension Pack
   - Flutter
   - ESLint
   - Prettier
2. Open workspace root

## Troubleshooting

### Port Conflicts
If port 8080 is in use:
```bash
# Find process using port
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # macOS/Linux
```

### Database Connection
Ensure PostgreSQL is running and accessible:
```bash
psql -h localhost -U postgres -d kartezy
```
