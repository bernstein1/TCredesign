# TouchCare Unified Platform: Product Engineering Design

**Version:** 1.0
**Date:** 2025-11-13
**Status:** Design Phase - Ready for Implementation

---

## Executive Summary

This document provides a complete product-engineering design for the TouchCare unified web platform, transforming TouchCare from a fragmented mobile app + website into a single, mobile-optimized web application.

### Platform Vision

A modern, unified web platform that consolidates the member experience into one mobile-first application with:

- **Member Portal**: Consumer-facing dashboard, messaging, documents, wallet, scheduling
- **Admin Portal**: Configuration, case management, analytics, white-labeling
- **Premium Tier**: TouchCare Blue with enhanced visual treatment and priority service
- **White-Label Support**: Multi-tenant architecture with client-specific branding

### Strategic Objectives

1. **Consolidate Experience**: Single web app replaces fragmented mobile + web
2. **Usability First**: Reduce friction, minimize cognitive load, thumb-optimized mobile UI
3. **Centralized Home**: Unified dashboard as primary navigation hub
4. **Proactive Engagement**: Task-based onboarding and progressive profile completion
5. **Modern Design**: Consumer banking/productivity app quality
6. **Extensibility**: White-label ready, premium tier support, API-first architecture

### Architecture Approach

**Stack Recommendation:**
- **Frontend**: React + Next.js + TypeScript
- **State Management**: React Query + Zustand/Context
- **Styling**: CSS-in-JS (Styled Components) or Tailwind + CSS Variables for theming
- **Backend**: Node.js + Express/NestJS or similar (REST + GraphQL hybrid)
- **Real-time**: WebSocket (Socket.io) or Server-Sent Events
- **Database**: PostgreSQL + Redis (caching/sessions)
- **Auth**: Custom passwordless + OAuth2 (Google, Microsoft)
- **File Storage**: S3-compatible object storage
- **CDN**: CloudFront or similar for assets and white-label resources

**Key Architectural Patterns:**
- Progressive Web App (PWA) for mobile installation
- Multi-tenant architecture with isolated branding and configuration
- Design token-based theming system supporting base + white-label + premium overlays
- API-first design with clear separation between member and admin APIs
- Real-time messaging via WebSocket with fallback polling
- Optimistic UI updates with rollback on error
- Server-side rendering (SSR) for public pages, client-side for authenticated experiences

---

## Documentation Structure

This design is organized into the following sections:

### 1. [Information Architecture](./architecture/information-architecture.md)

Complete navigation structure, page hierarchy, and permissions model for both Member and Admin portals.

**Key Topics:**
- Member Portal navigation (mobile-first, bottom nav + sidebar)
- Admin Portal navigation (desktop-optimized, persistent sidebar)
- Role-based access control (RBAC) model
- Deep linking and routing strategy

### 2. [Data Models](./architecture/data-models.md)

Comprehensive entity-relationship diagram and detailed data models for all platform entities.

**Key Entities:**
- Member, Dependent, Employer, Plan, Tier
- Case, Message, Notification
- Document, Category, Upload
- Appointment, Consultant, Service
- Wallet, Card, InsuranceInfo
- Settings, Preferences, Session
- BrandingConfig, Theme, Client

### 3. [API Design](./architecture/api-design.md)

Complete REST + GraphQL API specifications with request/response schemas for all platform operations.

**Key Endpoints:**
- Authentication & Sessions
- Member onboarding and profile
- Dashboard aggregated data
- Cases and messaging (REST + WebSocket)
- Documents and uploads
- Wallet and dependents
- Scheduling integration
- Admin configuration and management
- Analytics and reporting

### 4. [Design System](./design/design-system.md)

Component library specification, design tokens, theming strategy, and visual guidelines.

**Key Topics:**
- Design tokens (colors, typography, spacing, shadows, radii)
- Core components (buttons, inputs, cards, modals, etc.)
- Layout primitives (containers, grids, stacks)
- Theming architecture (base + white-label + TouchCare Blue)
- Accessibility requirements (WCAG 2.1 AA)
- Responsive breakpoints and mobile-first patterns

### 5. [UX Flows](./design/ux-flows.md)

Detailed user experience flows, state machines, and interaction patterns for all key member and admin journeys.

**Key Flows:**
- Onboarding (3-phase progressive model)
- Authentication (passwordless, SSO, biometric)
- Dashboard and task completion
- Messaging and case management
- Document viewing and upload
- Wallet access and sharing
- Appointment scheduling
- Settings and account management
- Admin case handling and notifications

### 6. [Implementation Plan](./planning/implementation-plan.md)

Phased implementation roadmap with MVP definition, milestones, dependencies, risks, and technical considerations.

**Key Topics:**
- MVP scope definition (Phase 1: 3-4 months)
- Feature prioritization (High/Medium/Low)
- Technical dependencies and integrations
- Risk assessment and mitigation
- Team structure recommendations
- Quality assurance and testing strategy
- Launch and rollout plan

---

## Quick Start for Implementation Teams

### Recommended Reading Order

1. **Product Managers & Designers**: Start with [UX Flows](./design/ux-flows.md) and [Design System](./design/design-system.md)
2. **Frontend Engineers**: Review [Design System](./design/design-system.md), [Information Architecture](./architecture/information-architecture.md), and [API Design](./architecture/api-design.md)
3. **Backend Engineers**: Focus on [Data Models](./architecture/data-models.md) and [API Design](./architecture/api-design.md)
4. **Tech Leads**: Read [Implementation Plan](./planning/implementation-plan.md) first, then dive into architecture docs

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Mobile-first PWA** | Primary user base accesses via mobile; PWA enables app-like experience without app store friction |
| **Passwordless auth** | Reduces friction, improves security, aligns with modern consumer expectations |
| **Task-driven onboarding** | Progressive disclosure reduces initial friction while ensuring profile completion |
| **Centralized dashboard** | Single "today view" reduces navigation complexity and improves engagement |
| **Real-time messaging** | Modern consumer expectation; reduces perceived support latency |
| **Design token theming** | Enables white-label and premium tier without code changes |
| **API-first architecture** | Supports future mobile apps, integrations, and third-party extensions |
| **Multi-tenant data model** | Single codebase serves all clients with isolated branding and configuration |

### Non-Functional Requirements

- **Performance**:
  - Initial page load < 2s on 4G
  - Time to interactive < 3s
  - Dashboard API response < 500ms
  - Messaging latency < 100ms (WebSocket)

- **Scalability**:
  - Support 100K+ active members
  - 1K concurrent users per instance
  - Horizontal scaling for API and WebSocket servers

- **Security**:
  - SOC 2 Type II compliance
  - HIPAA compliance for PHI
  - Encryption at rest and in transit (TLS 1.3)
  - Rate limiting and DDoS protection
  - OWASP Top 10 mitigation

- **Accessibility**:
  - WCAG 2.1 AA compliance
  - Screen reader support (ARIA)
  - Keyboard navigation
  - Color contrast 4.5:1 minimum
  - Resizable text up to 200%

- **Browser Support**:
  - Chrome/Edge (last 2 versions)
  - Safari (last 2 versions)
  - Firefox (last 2 versions)
  - Mobile Safari iOS 14+
  - Chrome Android (last 2 versions)

---

## Glossary

| Term | Definition |
|------|------------|
| **Member** | End user of TouchCare services (employee, dependent) |
| **Admin** | TouchCare employee managing platform and supporting members |
| **Employer** | Organization providing TouchCare as a benefit |
| **Plan** | Benefit package configuration for an employer |
| **Case** | Support conversation thread between member and admin |
| **Dependent** | Family member covered under member's benefits |
| **Wallet** | Digital health card and info repository |
| **Task Bar** | Persistent onboarding/setup task list on dashboard |
| **TouchCare Blue** | Premium tier with enhanced visual treatment and priority support |
| **White-Label** | Client-specific branding applied to platform |
| **Consultant** | TouchCare specialist providing scheduled consultations |
| **Service** | Partner or internal clinical service accessible to members |

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-13 | Product Engineering Team | Initial design specification |

---

## Next Steps

1. **Stakeholder Review**: Share with product, design, and engineering leadership
2. **Technical Validation**: Validate architecture and technology choices with senior engineers
3. **Effort Estimation**: Engineering team to estimate story points for MVP scope
4. **Design Mockups**: Design team to create high-fidelity mockups based on UX flows and design system
5. **Prototype**: Build clickable prototype for usability testing
6. **Sprint Planning**: Break down Phase 1 into 2-week sprints
7. **Kickoff**: Begin implementation

---

For questions or clarifications, refer to the detailed documentation in each section.
