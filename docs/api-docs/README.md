# API Documentation

Kartezy platform API documentation for all backend services.

## Structure
- `backend/<service>/README.md` — Per-service API endpoint documentation
- `docs/openapi/` — OpenAPI/Swagger specification files
- Swagger UI: `http://<service>:<port>/swagger-ui.html` (development)

## API Conventions
- All REST APIs use JSON request/response bodies
- Authentication via JWT Bearer token in `Authorization` header
- Pagination uses `page`, `size`, and `sort` query parameters
- Error responses follow RFC 7807 (Problem Details)
- Rate limiting applied at API Gateway level

## Service Ports
| Service | Port |
|---------|------|
| API Gateway | 8080 |
| Auth Service | 8081 |
| User Service | 8082 |
| Merchant Service | 8083 |
| Catalog Service | 8084 |
| ... (see backend READMEs for full list) |
