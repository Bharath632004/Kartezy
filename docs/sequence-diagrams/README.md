# Sequence Diagrams

System interaction sequence diagrams for key Kartezy flows.

## Flows

| Diagram | Description | Format |
|---------|-------------|--------|
| `order-flow.puml` | Customer places order → Merchant accepts → Delivery assigned → Delivered | PlantUML |
| `payment-flow.puml` | Customer selects payment → COD/Online → Gateway callback → Confirmation | PlantUML |
| `auth-flow.puml` | User login → OTP/Password → JWT generation → API access | PlantUML |
| `search-flow.puml` | User searches → Query parsing → Elasticsearch → Results ranking | PlantUML |
| `notification-flow.puml` | Event published → Kafka → Notification service → FCM/Email/SMS | PlantUML |

## Tooling
Diagrams use PlantUML format. Generate with:
```bash
# Install PlantUML (requires Java)
java -jar plantuml.jar docs/sequence-diagrams/*.puml
```
