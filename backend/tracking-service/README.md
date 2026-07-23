# TrackingService

## Overview
The tracking-service is a microservice in the Kartezy platform that handles real-time order and delivery tracking via WebSocket.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: 8090
- Database: kartezy_tracking
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
