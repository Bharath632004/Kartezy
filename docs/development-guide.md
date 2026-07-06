# Development Guide

This document outlines the setup and development practices for the Kartezy project.

## Prerequisites

- **Java**: Version 17 or higher (OpenJDK or Oracle JDK)
- **Node.js**: Version 18 or higher (LTS)
- **Flutter**: Version 3.0 or higher
- **Docker**: Version 20.10 or higher
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

## Prerequisites

- **Java**: Version 17 or higher (OpenJDK or Oracle JDK)
- **Node.js**: Version 18 or higher (LTS)
- **Flutter**: Version 3.0 or higher
- **Docker**: Version 20.10 or higher
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

Database schema changes are managed using Flyway (or similar). Migration scripts are located in the `database/` directory.

To apply migrations:

```bash
# Example for a service that uses Flywheel
./mvnw flyway:migrate
```

## Environment Configuration

Configuration is managed through Spring Cloud Config. The `config-server` service serves configuration to all other services.

Local development can use `application.yml` in each service's `src/main/resources` directory.

For Docker and Kubernetes, environment variables are used to override configuration.

## Logging

We use SLF4J with Logback for logging in Java services. Log levels can be configured via `application.yml` or environment variables.

In JavaScript and Dart, we use console.log for debugging, but in production, we rely on structured logging sent to a centralized system.

## Debugging

### Backend

- Use your IDE's debugger (IntelliJ, Eclipse, VS Code) to attach to the running JVM.
- Remote debugging is enabled via the `JAVA_TOOL_OPTIONS` environment variable.

### Frontend

- Use browser developer tools for React applications.
- Use Flutter DevTools or IDE debugging for Flutter applications.

## Performance Profiling

- **Java**: Use Java Flight Recorder (JFR) or Async Profiler.
- **JavaScript**: Use Chrome DevTools performance tab.
- **Flutter**: Use Flutter's performance overlay and DevTools.

## Security

- Never commit secrets to the repository. Use environment variables or a secrets management system.
- All dependencies are scanned for vulnerabilities using Dependabot and similar tools.
- Regular security audits are conducted using tools like OWASP ZAP and Snyk.

## Getting Help

If you encounter issues, please check the documentation in the `docs/` directory or reach out to the team via the project's communication channels.