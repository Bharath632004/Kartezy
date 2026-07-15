# API Standards

## REST Design
- Use nouns for resource endpoints: `/orders`, `/users`, `/products`
- HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- Version via header: `Accept: application/vnd.kartezy.v1+json`

## Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "traceId": "uuid"
}
```

## Pagination
```json
{
  "content": [],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

## Error Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["error1", "error2"],
  "traceId": "uuid"
}
```

## Authentication
- JWT Bearer token in Authorization header
- Refresh token mechanism
- Rate limiting per API key
