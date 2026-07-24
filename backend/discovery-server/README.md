# Discovery Server

Service discovery and registration (Eureka) server.

## Features
- Service registry for all microservices
- Health-based instance registration
- Heartbeat monitoring
- Load balancing support
- Zone affinity

## Tech Stack
- Netflix Eureka Server

## Running
```bash
cd backend
mvn spring-boot:run -pl discovery-server
```

## Dashboard
- Eureka Dashboard: `http://localhost:8761`

## Port
- Server: 8761
