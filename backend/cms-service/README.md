# CmsService

## Overview
The cms-service is a microservice in the Kartezy platform that handles content management for banners and pages.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: 8097
- Database: kartezy_cms
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
