# AnalyticsService

## Overview
The analytics-service is a microservice in the Kartezy platform that handles business analytics and metrics aggregation.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: 8093
- Database: kartezy_analytics
- Dependencies: Config Server, Discovery Server, Auth Service

## Building
```bash
mvn clean package -DskipTests
```

## Running
```bash
mvn spring-boot:run
```

## Testing
```bash
mvn test
```
