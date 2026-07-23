# RabbitMQ Configuration

## Version
RabbitMQ 3.13.x (Management-enabled)

## Purpose
- Task/work distribution queues
- Delayed/retry message processing
- Email and SMS notification queues
- Report generation task queues

## Queues

| Queue | Type | Description |
|-------|------|-------------|
| `email.queue` | Direct | Email sending tasks |
| `sms.queue` | Direct | SMS notification tasks |
| `report.queue` | Direct | Report generation tasks |
| `retry.dlq` | Dead-letter | Failed message retry handler |

## Configuration
```yaml
rabbitmq:
  image: rabbitmq:3.13-management-alpine
  ports:
    - "5672:5672"
    - "15672:15672"
```

## Management UI
- URL: http://localhost:15672
- Default credentials: `guest`/`guest`
