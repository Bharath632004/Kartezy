# Contributing to Kartezy

## Development Setup

### Prerequisites
- JDK 21 (Temurin recommended)
- Docker & Docker Compose
- Node.js 20+
- Flutter 3.22+
- Maven 3.9+
- Git

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/kartezy/kartezy.git
cd kartezy

# 2. Set up environment
cp .env.example .env
# Edit .env with appropriate values

# 3. Start infrastructure (PostgreSQL, Redis, Kafka, etc.)
cd devops/docker
docker compose up -d postgres redis kafka

# 4. Build backend
cd ../../backend
mvn clean install -DskipTests

# 5. Start services (example: auth-service)
java -jar auth-service/target/auth-service-*.jar

# 6. Start AI Platform
cd ../ai-platform
npm install
npm run dev

# 7. Start Admin Dashboard
cd ../apps/admin-dashboard
npm install
npm run dev
```

## Coding Standards

### Java/Spring Boot
- Follow existing project structure
- Use Lombok for boilerplate reduction
- Write unit tests for all services
- Use MapStruct for DTO conversions
- Document REST APIs with OpenAPI/Swagger

### Flutter
- Follow effective dart style guide
- Use Riverpod for state management
- Create reusable widgets
- Write widget and unit tests

### TypeScript/Next.js
- Use TypeScript strictly
- Follow ESLint configuration
- Use React hooks, not class components
- Write tests for critical components

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code improvements
- `docs/description` - Documentation changes
- `infra/description` - Infrastructure changes

### Commit Messages
Follow conventional commits: `type(scope): description`

Examples:
- `feat(auth): add OAuth2 Google login`
- `fix(order): resolve null pointer in payment flow`
- `refactor(catalog): extract search logic to service`

### Pull Request Process
1. Create feature branch from `develop`
2. Write tests for changes
3. Ensure CI passes
4. Request review from 2 team members
5. Squash merge to `develop`

## Testing

### Backend
```bash
cd backend
mvn clean verify
```

### Mobile Apps
```bash
cd apps/customer-mobile
flutter test
```

### Web Apps
```bash
cd apps/admin-dashboard
npm test
```

## Code Review Guidelines

- Check for security vulnerabilities
- Verify error handling
- Ensure proper logging
- Check for performance issues
- Validate test coverage
- Review API documentation

## Need Help?
- Check [docs/](./docs/) for guides
- Ask in #development Slack channel
- Contact the architecture team
