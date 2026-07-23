# OpenSearch / Elasticsearch Configuration

## Version
OpenSearch 2.x or Elasticsearch 8.x

## Purpose
- Full-text product search
- Store and category search
- Autocomplete and suggestions
- Log analytics and aggregation
- Business intelligence queries

## Indices

| Index | Shards | Description |
|-------|--------|-------------|
| `products` | 3 | Product catalog search |
| `stores` | 2 | Store/merchant search |
| `orders` | 3 | Order search for support |
| `logs` | 5 | Application log aggregation |

## Configuration
```yaml
opensearch:
  image: opensearchproject/opensearch:2.14.0
  environment:
    - discovery.type=single-node
    - DISABLE_SECURITY_PLUGIN=true
```
