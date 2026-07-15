# Development Guide

This document outlines the setup and development practices for the Kartezy project.

## Prerequisites- **Java**: Version 21 or higher (OpenJDK or Oracle JDK)

- **Node.js**: Version 20 or higher (LTS)

- **Flutter**: Stable channel (Dart 3.x)

- **Docker**: Version 24 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: Version 2.30 or higher

## Setting up the Development Environment

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/kartezy.git
cd kartezy
```

### 2. Backend Services

All backend services are built with Maven. To build a specific service:

```bash
cd backend/service-name
./mvnw clean install
```

To run a service locally:

```bash
./mvnw spring-boot:run
```

### 3. Frontend Applications

#### React Applications

```bash
cd apps/app-name
npm install
npm start
```

#### Flutter Applications

```bash
cd apps/app-name
flutter pub get
flutter run
```

### 4. Running All Services with Docker Compose

We provide a `docker-compose.yml` file for local development:

```bash
cd devops/docker
docker-compose up
```

This will start the essential services (discovery-server, config-server, api-gateway, and others).

### 5. Running Tests

#### Backend

```bash
cd backend/service-name
./mvnw test
```

#### Frontend (React)

```bash
cd apps/app-name
npm test
```

#### Frontend (Flutter)

```bash
cd apps/app-name
flutter test
```

## Code Quality

We use several tools to ensure code quality:

- **Java**: Checkstyle, SpotBugs, PMD, and Google Java Format
- **JavaScript/TypeScript**: ESLint and Prettier
- **Dart**: flutter_lints

### Running Code Quality Checks

#### Backend

```bash
cd backend
mvn verify
```

#### Frontend (React)

```bash
cd apps/app-name
npm run lint
```

#### 

We'll create a simple lint script in the package.json, but for now, we'll just note that we use ESLint and Prettier.

We'll create a development guide that mentions the tools.

Let's continue with the coding standards.

But first, let's finish the development guide by adding a section on code quality.

We'll update the development guide to include the code quality section.

We'll replace the file with an updated version.










<tool_call>
<function=Write>
<parameter=content>
# Development Guide

This document outlines the setup and development practices for the Kartezy project.

## Prerequisites- **Java**: Version 21 or higher (OpenJDK or Oracle JDK)

- **Node.js**: Version 20 or higher (LTS)

- **Flutter**: Stable channel (Dart 3.x)

- **Docker**: Version 24 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: Version 2.30 or higher

## Setting up the Development Environment

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/kartezy.git
cd kartezy
```

### 2. Backend Services

All backend services are built with Maven. To build all services:

```bash
cd backend
./mvnw clean install -DskipTests
```

To run a specific service locally:

```bash
cd backend/service-name
./mvnw spring-boot:run
```

### 3. Frontend Applications

#### Next.js Applications (Website & Admin Dashboard)

```bash
cd apps/kartezy-website  # or apps/admin-dashboard
npm install
npm run dev
```

#### Flutter Applications (Mobile)

```bash
cd apps/customer-mobile  # or merchant-mobile, delivery-mobile
flutter pub get
flutter run
```

### 4. Running All Services with Docker Compose

```bash
cd devops/docker
docker compose up
```

This starts all infrastructure (PostgreSQL, Redis, MongoDB, Kafka, Elasticsearch), service infrastructure (Eureka, Config Server, API Gateway), business microservices, and AI microservices.

### 5. Running Tests

#### Backend

```bash
cd backend/service-name
./mvnw test
```

#### Frontend (Next.js)

```bash
cd apps/app-name
npm test
```

#### Frontend (Flutter)

```bash
cd apps/app-name
flutter test
```

## Code Quality

We enforce code quality through automated tools:

### Backend (Java)

- **Checkstyle**: Enforces Google Java Style
- **SpotBugs**: Finds bugs in Java code
- **PMD**: Detects common programming flaws
- **Google Java Format**: Automatically formats Java code

To run all checks:

```bash
cd backend
mvn verify
```

### Frontend (JavaScript/TypeScript)

- **ESLint**: Identifies and reports on patterns in JavaScript
- **Prettier**: Code formatter

We use the `.eslintrc.js` and `.prettierrc` configurations at the root.

To lint and fix:

```bash
cd apps/app-name
npm run lint
# or
npm run lint -- --fix
```

### Frontend (Dart/Flutter)

- **flutter_lints**: A recommended set of linters for Flutter apps

To run the analyzer:

```bash
cd apps/app-name
flutter analyze
```

## Database Migrations

Database schema changes are managed through Flyway. Migration scripts are located in the `database/` directory.

To apply migrations:

```bash
cd backend/service-name
./mvnw flyway:migrate
```

## Environment Configuration

Configuration is managed through Spring Cloud Config. The `config-server` service serves configuration to all other services via the `config-repo/` directory.

Local development uses `application.yml` in each service's `src/main/resources` directory.

For Docker and Kubernetes, environment variables override configuration at runtime.

## Logging

- **Java**: SLF4J with Logback
- **JavaScript/TypeScript**: Structured logging via configured transports
- **Dart**: Logging framework with environment-based levels

## Debugging

### Backend

- Use your IDE's debugger (IntelliJ, VS Code) to attach to the running JVM.
- Remote debugging is enabled via `JAVA_TOOL_OPTIONS` environment variable.

### Frontend

- **Next.js**: Browser developer tools + React DevTools + Next.js debugger
- **Flutter**: Flutter DevTools or IDE debugging

## Performance Profiling

- **Java**: Java Flight Recorder (JFR) or Async Profiler
- **JavaScript**: Chrome DevTools Performance tab
- **Flutter**: Flutter's performance overlay and DevTools

## Security

- Never commit secrets to the repository. Use environment variables or a secrets management system.
- All dependencies are scanned for vulnerabilities using Dependabot.
- Regular security audits are conducted using OWASP ZAP and Snyk.

## Getting Help

If you encounter issues, please check the documentation in the `docs/` directory or reach out to the team.