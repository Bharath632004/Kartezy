# Search Service

Elasticsearch-powered search and indexing service.

## Features
- Full-text product search
- Autocomplete suggestions
- Faceted filtering (category, price, brand)
- Geo-location based search
- Search analytics & trending
- Index management

## Tech Stack
- Elasticsearch / OpenSearch
- Kafka (index updates)
- Redis (search cache)

## API
`/api/v1/search/*` — Search endpoints

## Events Consumed
- `product.*` — Product create/update for indexing
- `merchant.*` — Merchant updates for store search

## Configuration
- `ELASTICSEARCH_HOST`: Elasticsearch connection
- `ELASTICSEARCH_PORT`: Elasticsearch port (default: 9200)
