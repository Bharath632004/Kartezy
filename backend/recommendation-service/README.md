# RecommendationService

## Overview
The recommendation-service is a microservice in the Kartezy platform that handles AI-powered product recommendations.

## API Endpoints
- `GET /health` - Health check endpoint
- (More endpoints to be implemented)

## Configuration
- Port: 8092
- Database: kartezy_recommendation
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
