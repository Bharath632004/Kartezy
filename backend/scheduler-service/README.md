# SchedulerService

## Overview
The scheduler-service is a microservice in the Kartezy platform that handles distributed task scheduling.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: 8105
- Database: kartezy_scheduler
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
