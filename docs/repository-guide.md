# Repository Guide

This document provides an overview of the Kartezy repository structure and how to navigate it.

## Repository Structure

The repository is organized as a monorepo with the following top-level directories:

- `backend/`: Contains all backend services (Spring Boot microservices)
- `apps/`: Contains all frontend applications (React, Flutter)
- `database/`: Database schemas and migration scripts
- `devops/`: Docker, Kubernetes, Terraform, and NGINX configurations
- `docs/`: Documentation
- `infra/`: Infrastructure as code and scripts
- `scripts/`: Utility scripts for development and deployment
- `.github/`: GitHub workflows, issue templates, and pull request templates

Each service and application is self-contained and can be built and deployed independently.

## Getting Started

To get started with development, please refer to the [Development Guide](./development-guide.md).

## Contributing

Please read our [Contributing Guidelines](./contributing.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is proprietary and confidential.