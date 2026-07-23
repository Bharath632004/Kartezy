# Apache Kafka Configuration

## Version
Confluent Platform 7.6.x / Apache Kafka 3.6.x

## Purpose
- Order lifecycle events
- Payment confirmation/refund events
- Delivery status updates
- Notification triggers
- Analytics event stream

## Topics

| Topic | Partitions | Retention | Description |
|-------|-----------|-----------|-------------|
| `order.events` | 3 | 7 days | Order lifecycle events |
| `payment.events` | 3 | 30 days | Payment transactions |
| `delivery.events` | 3 | 7 days | Delivery status updates |
| `notification.events` | 2 | 3 days | Push notification triggers |
| `analytics.events` | 3 | 90 days | User and system analytics |

## Configuration
```yaml
kafka:
  image: confluentinc/cp-kafka:7.6.1
  environment:
    KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE: "true"
```
