# Kartezy

A modern, scalable food delivery platform inspired by Blinkit, Zepto, Instamart, Amazon Fresh, and Uber Eats.

## Repository Structure

```
Kartezy/
├── backend/                  # Backend services (Spring Boot microservices)
│   ├── api-gateway/          # API Gateway service
│   ├── config-server/        # Spring Cloud Config Server
│   ├── discovery-server/     # Service Discovery (Eureka)
│   ├── auth-service/         # Authentication and Authorization service
│   ├── user-service/         # User management service
│   ├── merchant-service/     # Merchant/restaurant management
│   ├── catalog-service/      # Product catalog service
│   ├── inventory-service/    # Inventory management
│   ├── order-service/        # Order processing
│   ├── payment-service/      # Payment processing
│   ├── delivery-service/     # Delivery management
│   ├── notification-service/ # Notification service (email, SMS, push)
│   ├── review-service/       # Review and rating service
│   ├── wallet-service/       # Wallet and payment methods
│   ├── analytics-service/    # Analytics and reporting
│   ├── recommendation-service/ # Recommendation engine
│   └── shared/               # Shared libraries and common utilities
├── apps/                     # Frontend applications
│   ├── customer-mobile/      # Customer mobile app (Flutter)
│   ├── merchant-mobile/      # Merchant mobile app (Flutter)
│   ├── delivery-mobile/      # Delivery personnel mobile app (Flutter)
│   ├── customer-web/         # Customer web app (React)
│   ├── merchant-web/         # Merchant web app (React)
│   ├── admin-dashboard/      # Admin dashboard (React) - ENTERPRISE EDITION
│   └── landing-page/         # Landing page (React)
├── database/                 # Database schemas and migrations
├── devops/                   # DevOps and infrastructure
│   ├── docker/               # Dockerfiles
│   ├── kubernetes/           # Kubernetes manifests
│   ├── terraform/            # Terraform infrastructure as code
│   └── nginx/                # NGINX configurations
├── docs/                     # Documentation
├── infra/                    # Infrastructure scripts
├── scripts/                  # Utility scripts
└── .github/                  # GitHub workflows and issue templates
```

## Admin Dashboard (Enterprise Edition)

The admin dashboard is a comprehensive enterprise-grade administration panel built with Next.js 15, React 19, TypeScript, Material-UI, and Tailwind CSS. It provides complete control over all aspects of the Kartezy platform.

### Features

#### Finance Management
- Revenue Overview & Analytics
- Commission Management & Tracking
- Settlement Processing & Reconciliation
- Wallet Management & Transactions
- Refund Processing & Dispute Handling
- Tax Management & GST Reporting
- Payout Management & Scheduling
- Transaction Monitoring & Audit Trail

#### Marketing & Promotions
- Coupon & Discount Code Management
- Campaign Creation & Performance Tracking
- Push Notification Scheduling & Analytics
- Email Campaign Builder & Automation
- SMS Campaign Management & Delivery Reports
- Referral Program Configuration & Tracking
- Loyalty Program Management & Tier System
- Sponsored Products & Bidding System

#### Content Management System (CMS)
- Banner Management & A/B Testing
- Category Hierarchy Management
- Static Page Creation & Editing
- FAQ Management & Organization
- Blog Post Creation & Publishing
- Terms & Conditions Management
- Privacy Policy Administration
- Rich Text Content Editor (WYSIWYG)

#### Reports & Analytics
- Revenue Reports with Export Options
- Sales Performance Analytics
- Merchant Performance Reports
- Customer Behavior & Cohort Analysis
- Delivery Performance Metrics
- Payment Success Rate Analysis
- Inventory Turnover Reports
- Custom Report Builder with Scheduling

#### Advanced Analytics
- KPI Dashboard with Real-time Updates
- Heatmap Visualization for User Behavior
- Retention Analysis & Cohort Studies
- Funnel Analysis & Conversion Optimization
- Growth Metrics & Trend Prediction
- Predictive Analytics & Forecasting

#### Support & Operations
- Ticket Management System
- Live Chat Monitoring & History
- Customer Complaint Tracking
- Escalation Workflow Management
- System Health Monitoring
- Performance Analytics & Alerts
- Audit Trail & Compliance Reporting
- User Activity Logging

#### System Settings & Configuration
- Platform Configuration & Feature Flags
- Payment Gateway Integration Settings
- Notification Template Management
- Security Policies & Access Control
- Role-Based Access Control (RBAC)
- Session Management & Policies
- Backup & Disaster Recovery Settings
- API Rate Limiting & Throttling

### Technical Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript 5.x
- **Styling**: Material-UI (MUI) v6 + Tailwind CSS
- **State Management**: Zustand with persistence middleware
- **Data Fetching**: React Query (TanStack Query v5)
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form v7 + Zod validation
- **Authentication**: JWT with refresh token mechanism
- **UI Framework**: Material Design 3 with dark/light themes
- **Data Visualization**: Recharts & Chart.js integration
- **Internationalization**: i18next for multi-language support
- **Testing**: Jest + React Testing Library + Cypress E2E
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Performance**: Code splitting, lazy loading, React.Suspense
- **Accessibility**: WCAG 2.2 compliance, ARIA labels, keyboard navigation

### Key Architectural Decisions

1. **Modular Store Architecture**: Separate Zustand stores for each domain (finance, marketing, cms, etc.)
2. **Server Components**: Leveraging React Server Components for improved performance and SEO
3. **Optimistic Updates**: Immediate UI feedback with background synchronization
4. **Real-time Updates**: WebSocket integration for live data synchronization
5. **Role-Based Access Control**: Dynamic menu rendering based on user permissions
6. **Error Boundaries**: Comprehensive error handling with fallback UIs
7. **Loading & Empty States**: Consistent UX patterns across all components
8. **Export Functionality**: CSV, Excel, and PDF export for all reports
9. **Data Validation**: Schema validation with Zod at form level
10. **Security**: XSS protection, CSRF tokens, input sanitization

### Integration Points

The admin dashboard integrates with the following backend microservices:

- **Auth Service**: Authentication, authorization, role management
- **User Service**: Customer and administrator user management
- **Merchant Service**: Restaurant/merchant onboarding and management
- **Catalog Service**: Product and category management
- **Order Service**: Order lifecycle management and tracking
- **Payment Service**: Payment processing and reconciliation
- **Wallet Service**: Digital wallet and transaction management
- **Delivery Service**: Assignment tracking and performance metrics
- **Notification Service**: Email, SMS, and push notification delivery
- **Analytics Service**: Event tracking and metric aggregation
- **Recommendation Service**: Personalization and suggestion algorithms

### Getting Started with Admin Dashboard

```bash
# Navigate to the admin dashboard directory
cd apps/admin-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file in the `apps/admin-dashboard` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
NEXT_PUBLIC_APP_NAME=Kartezy Admin Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Available Routes

- `/dashboard` - Main dashboard with overview metrics
- `/dashboard/finance/*` - Financial management sections
- `/dashboard/marketing/*` - Marketing and promotions sections
- `/dashboard/cms/*` - Content management sections
- `/dashboard/reports/*` - Reporting and analytics sections
- `/dashboard/analytics/*` - Advanced analytics sections
- `/dashboard/support/*` - Customer support sections
- `/dashboard/settings/*` - System configuration sections

### Testing

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y

# Run performance tests
npm run test:perf
```

### Deployment

The admin dashboard can be deployed to various platforms:

- **Vercel** (recommended for Next.js applications)
- **AWS Amplify**
- **Docker containers**
- **Kubernetes** (using provided manifests in devops/kubernetes)

### Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### License

This project is proprietary and confidential.

### Contact

For any inquiries, please contact [your-email@example.com].