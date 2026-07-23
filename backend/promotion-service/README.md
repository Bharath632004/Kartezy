# PromotionService

## Overview
The promotion-service is a microservice in the Kartezy platform that handles promotions, offers, and discount campaigns.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: 8086
- Database: kartezy_promotion
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
