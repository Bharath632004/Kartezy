# ReviewService

## Overview
The review-service is a microservice in the Kartezy platform that handles product reviews and ratings.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: 8091
- Database: kartezy_review
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
