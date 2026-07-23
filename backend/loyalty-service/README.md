# LoyaltyService

## Overview
The loyalty-service is a microservice in the Kartezy platform that handles loyalty points and rewards.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: 8101
- Database: kartezy_loyalty
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
