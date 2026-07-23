# AdminService

## Overview
The admin-service is a microservice in the Kartezy platform that handles admin panel backend services.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: 8098
- Database: kartezy_admin
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
