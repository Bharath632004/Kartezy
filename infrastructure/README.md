# Kartezy Infrastructure

Infrastructure-as-code and platform configuration for Kartezy's production and staging environments.

## Infrastructure Components

| Component | Directory | Description | Status |
|-----------|-----------|-------------|--------|
| Docker | `docker/` | Per-service multi-stage Dockerfiles | 📋 Planned |
| Docker Compose | `compose/` | Local development and staging orchestration | 📋 Planned |
| Kubernetes | `kubernetes/` | Production K8s manifests (Deployments, Services, Ingress, HPA, PDBs) | ✅ Managed in `devops/kubernetes/` |
| NGINX | `nginx/` | Reverse proxy and load balancing | ✅ Managed in `devops/nginx/` |
| API Gateway | `api-gateway/` | Route configuration, rate limiting, CORS | ✅ Managed in `backend/api-gateway/` |
| Load Balancer | `load-balancer/` | Traffic distribution and failover | 📋 Planned |
| CDN | `cdn/` | Content delivery network (CloudFront/Cloudflare) | 📋 Planned |
| SSL/TLS | `ssl/` | Certificate management and renewal | 📋 Planned |
| Secrets Manager | `secrets/` | Secure credential storage (Vault/AWS Secrets Manager) | 📋 Planned |
| Monitoring | `monitoring/` | Prometheus, Grafana dashboards, alerting | ✅ Managed in `devops/kubernetes/monitoring*.yaml` |
| Logging | `logging/` | Centralized log aggregation (ELK/Loki) | 📋 Planned |
| Tracing | `tracing/` | Distributed tracing (OpenTelemetry, Jaeger) | 📋 Planned |

## Quick Reference

For operational infrastructure files (Dockerfiles, docker-compose, K8s manifests, NGINX config):
```
devops/docker/          → Dockerfiles and Compose files
devops/kubernetes/      → Kubernetes manifests
devops/nginx/           → NGINX configuration
```

For service-level infrastructure:
```
backend/<service>/Dockerfile   → Per-service Dockerfile
backend/<service>/pom.xml      → Build configuration
```
