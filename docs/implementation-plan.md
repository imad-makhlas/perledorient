# CODAvenue Implementation Plan

## Delivery strategy

Build vertical slices that leave the repository runnable after every phase. Each business rule follows red-green-refactor: add a failing test, confirm the expected failure, add the smallest implementation, then run the focused and broader suites.

## Phase 1: Repository and design-system foundation

- Create the monorepo workspaces and environment contract.
- Scaffold `apps/web` with React, Vite, strict TypeScript, Tailwind, routing, TanStack Query, forms, Zod, Vitest, and Playwright.
- Scaffold `apps/api` with Java 21, Spring Boot, Maven Wrapper, validation, JPA, security, Flyway, PostgreSQL, OpenAPI, and Actuator.
- Add the CODAvenue semantic design tokens based on the Investir Alia palette.
- Add bilingual provider, application shell, accessible primitives, error boundary, and responsive navigation.
- Verification: frontend unit smoke test, TypeScript check, lint, production build, and Spring context test.

## Phase 2: Catalogue vertical slice

- Add Flyway tables for category, brand, product, variant, images, and settings.
- Seed six categories, eight brands, and representative products covering variant and stock states.
- Test and implement public category, brand, search, product-list, and product-detail APIs.
- Test and implement storefront home, catalogue filters, product detail, variant selection, loading/empty/error states, and metadata helpers.
- Verification: catalogue API integration tests and React catalogue interaction tests.

## Phase 3: Cart and authoritative checkout

- Test and implement local-storage cart semantics, quantity changes, removal, and unavailable-variant handling.
- Test delivery-fee and total calculations before implementing the checkout quote service.
- Add quote endpoint returning authoritative line totals, delivery, discount, and total.
- Build cart drawer, cart page, delivery-threshold progress, checkout form, server quote, review, consent, and submission guard.
- Verification: calculation tests, stock validation tests, cart UI tests, and checkout validation tests.

## Phase 4: COD and WhatsApp orders

- Add order, order item, idempotency, and status-history migrations.
- Test and implement unique order numbers, immutable item snapshots, and `PENDING_CONFIRMATION` creation.
- Test and implement both payment methods while rejecting `ONLINE_PAYMENT` publicly.
- Test WhatsApp message encoding and ensure persistence happens before link creation.
- Build confirmation page, redirect fallback, support action, and continue-shopping action.
- Verification: API integration tests plus Playwright COD and WhatsApp journeys.

## Phase 5: Inventory and lifecycle

- Define and test the order transition matrix.
- Test transactional stock decrease on confirmation, restoration on eligible cancellation, insufficient-stock failure, and concurrent confirmation.
- Add administrator transition endpoints, internal notes, printable summary, and history view.
- Verification: PostgreSQL concurrency integration tests and admin status-update browser test.

## Phase 6: Authentication and administration

- Test and implement customer/admin cookie sessions, CSRF, role authorization, login throttling, and secure defaults.
- Build admin login and shell.
- Implement product, category, brand, order, customer, and settings workflows with safe archive/deactivation behavior.
- Implement dashboard queries for order, revenue, stock, city, method, and product metrics.
- Verification: authorization integration tests and React admin workflows.

## Phase 7: Accounts, content, tracking, and media

- Implement optional registration, sign-in, profile, saved addresses, order history, and detail.
- Implement tracking by order number plus normalized telephone number with rate limiting.
- Add About, Contact, FAQ, policies, privacy, and terms routes in both languages.
- Add storage abstraction, validated local uploads, multiple product images, and variant images.
- Verification: tracking-privacy, upload-validation, account, and content-route tests.

## Phase 8: Production readiness

- Complete responsive and WCAG 2.1 AA review.
- Add canonical links, route metadata, Open Graph, sitemap, robots, product JSON-LD, and breadcrumbs.
- Expand development data to at least 30 products and several orders.
- Add Dockerfiles, Compose health checks, profiles, JSON logging, `.env.example`, and operational README.
- Run all unit, integration, E2E, lint, type-check, and production-build commands.
- Record any environment-only limitation explicitly; do not mark the project complete while a required check fails.

## Commands used for verification

```powershell
npm.cmd --prefix apps/web run test
npm.cmd --prefix apps/web run lint
npm.cmd --prefix apps/web run typecheck
npm.cmd --prefix apps/web run build
apps\api\mvnw.cmd test
apps\api\mvnw.cmd verify
docker compose --env-file .env up --build
npm.cmd --prefix apps/web run test:e2e
```

