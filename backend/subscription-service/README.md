# SubscriptionService

## Overview
The subscription-service is a microservice in the Kartezy platform that handles subscription plans and recurring orders.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: 8100
- Database: kartezy_subscription
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
