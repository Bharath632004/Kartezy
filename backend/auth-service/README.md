# Auth Service

Identity and access management service for Kartezy.

## Overview

The Auth Service handles all authentication and authorization concerns for the Kartezy platform, including JWT token management, OAuth2 integration, OTP verification, session management, and role-based access control (RBAC).

## Features

- JWT-based authentication with refresh tokens
- OAuth2 resource server integration
- OTP verification (email/phone)
- Password encryption (BCrypt)
- Session management
- Role-based access control (RBAC)
- Account lockout protection
- Rate limiting

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/refresh` | Refresh JWT token |
| POST | `/api/v1/auth/otp/send` | Send OTP |
| POST | `/api/v1/auth/otp/verify` | Verify OTP |
| POST | `/api/v1/auth/logout` | Logout user |
| GET | `/health` | Health check |

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRATION` | Access token TTL (ms) | 86400000 |
| `JWT_REFRESH_TOKEN_EXPIRATION` | Refresh token TTL (ms) | 604800000 |
| `DB_URL` | PostgreSQL JDBC URL | jdbc:postgresql://postgres:5432/kartezy_auth |
| `DB_USERNAME` | Database username | kartezy |
| `DB_PASSWORD` | Database password | kartezy |

## Dependencies

- PostgreSQL (primary data store)
- Redis (session cache, OTP cache)
- Spring Security + OAuth2
- Spring Cloud Config client
- Eureka Discovery client

## Running

```bash
cd backend
mvn spring-boot:run -pl auth-service
```

## Testing

```bash
cd backend
mvn test -pl auth-service
```
