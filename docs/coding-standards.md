# Coding Standards

This document outlines the coding standards and conventions used in the Kartezy project.

## Java (Backend)

### Formatting

- We use **Google Java Format** for code formatting.
- Configuration is inherited from the parent POM and can be run via:
  ```bash
  mvn googleformat:format
  ```

### Linting and Static Analysis

- **Checkstyle**: Enforces the Google Java Style Guide.
  - Configuration: `checkstyle.xml` (if present) or default Google Checks during `mvn verify`.
- **SpotBugs**: Finds bugs in Java code.
- **PMD**: Detects common programming flaws.
- All checks are run during the `verify` phase.

### Dependencies

- Dependencies are managed via Maven.
- We use the Spring Boot BOM for dependency version management.
- New dependencies must be approved via a pull request review.

### Naming Conventions

- Classes: `PascalCase`
- Methods and variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Packages: `all lowercase, reversed domain name` (e.g., `com.kartezy.auth.service`)

### Comments

- Use Javadoc for public classes and methods.
- Use inline comments sparingly and only when the intent is not clear from the code.

## JavaScript/TypeScript (Frontend - React)

### Formatting

- We use **Prettier** for code formatting.
- Configuration is in `.prettierrc` at the repository root.
- To format code:
  ```bash
  npx prettier --write .
  ```

### Linting

- We use **ESLint** to enforce code quality and style.
- Configuration is in `.eslintrc.js` at the repository root.
- To lint:
  ```bash
  npm run lint
  ```
- To lint and fix:
  ```bash
  npm run lint -- --fix
  ```

### Dependencies

- Dependencies are managed via npm.
- We use a `package-lock.json` to ensure consistent installations.
- New dependencies must be reviewed and approved.

### Naming Conventions

- Components: `PascalCase`
- Variables and functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `camelCase` or `kebab-case` (consistent within a project)

### Comments

- Use JSDoc for functions and components that are part of a public API.
- Use inline comments to explain non-obvious logic.

## Dart/Flutter (Frontend - Mobile)

### Formatting

- We use `dart format` for code formatting.
- To format:
  ```bash
  flutter format .
  ```

### Linting

- We use the `flutter_lints` package (a recommended set of linters for Flutter).
- To analyze:
  ```bash
  flutter analyze
  ```

### Dependencies

- Dependencies are managed via `pubspec.yaml`.
- We use `pub get` to fetch dependencies.
- New dependencies must be reviewed and approved.

### Naming Conventions

- Classes: `PascalCase`
- Variables and functions: `camelCase`
- Constants: `kConstantName` or `static final` in `camelCase` (follows effective Dart)
- Files: `snake_case`

### Comments

- Use doc comments (`///`) for public APIs.
- Use block comments (`/* ... */`) for licensing headers.
- Use inline comments for complex logic.

## General Principles

1. **DRY (Don't Repeat Yourself)**: Extract common code into reusable functions, classes, or modules.
2. **KISS (Keep It Simple, Stupid)**: Prefer simple solutions over complex ones.
3. **YAGNI (You Aren't Gonna Need It)**: Do not add functionality until it is necessary.
4. **SOLID Principles**: Apply these object-oriented design principles where applicable.
5. **Clean Code**: Write code that is easy to read, understand, and maintain.

## Code Reviews

All code changes must be reviewed via a pull request. Reviewers should check for:

- Adherence to coding standards
- Correctness and completeness
- Test coverage (where applicable)
- Performance implications
- Security considerations

## Tools and Configuration

- **EditorConfig**: We use an `.editorconfig` file to maintain consistent coding styles across different editors and IDEs.
- **Prettier**: For JavaScript/TypeScript formatting.
- **ESLint**: For JavaScript/TypeScript linting.
- **Google Java Format**: For Java formatting.
- **Checkspotbugs and PMD**: For Java static analysis.
- **flutter_lints**: For Dart linting.

These tools are configured in the repository and should be run as part of your development workflow and CI pipeline.