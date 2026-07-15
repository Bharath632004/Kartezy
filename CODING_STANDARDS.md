# Coding Standards

## Java / Spring Boot
- **Package structure**: `com.kartezy.{service}.{layer}`
- **Layer pattern**: controller, service, repository, entity, dto, config, security, exception, client, event, scheduler, util, constants
- **Use Lombok**: @Getter, @Setter, @Builder, @RequiredArgsConstructor
- **Validation**: Jakarta Validation annotations on request DTOs
- **Exception handling**: Extend BaseException, use GlobalExceptionHandler
- **API responses**: Use ApiResponse<T> wrapper for all endpoints
- **Pagination**: Use PageResponse<T> for list endpoints
- **Authentication**: @PreAuthorize for method-level security
- **Transactions**: @Transactional on write operations
- **Logging**: Slf4j with Lombok @Slf4j

## Flutter / Dart
- **State management**: Riverpod only
- **Architecture**: Clean Architecture with feature-first structure
- **Models**: Freezed for immutable models, json_serializable for JSON
- **Networking**: Dio with interceptors
- **Local storage**: Hive + FlutterSecureStorage

## React / Next.js
- **State management**: Zustand + TanStack Query
- **Styling**: Material-UI + Tailwind CSS
- **API calls**: Axios with interceptors
- **Forms**: React Hook Form + Zod
- **File naming**: kebab-case for files, PascalCase for components
