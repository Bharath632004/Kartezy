# Entity-Relationship Diagrams

Database schema ER diagrams for Kartezy platform.

## Diagrams

| Diagram | Scope | Format |
|---------|-------|--------|
| `core-entities.puml` | Core domain entities (User, Order, Payment, Product) | PlantUML |
| `order-lifecycle.puml` | Order → Payment → Delivery → Notification | PlantUML |
| `merchant-ecosystem.puml` | Merchant → Store → Product → Inventory → Pricing | PlantUML |
| `customer-domain.puml` | Customer → Address → Cart → Wishlist → Review | PlantUML |
| `delivery-domain.puml` | Delivery Partner → Assignment → Tracking → Earnings | PlantUML |

## Tooling
ER diagrams are authored in PlantUML format and renderable via:
- VS Code PlantUML extension
- PlantUML online renderer (https://www.plantuml.com)
- `scripts/generate-diagrams.sh` — Batch generation script
