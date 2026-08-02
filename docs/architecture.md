# CODAvenue Architecture

## System overview

CODAvenue is a bilingual (English/French), single-vendor commerce platform for Morocco. The repository is a modular monorepo:

```text
apps/web   React 19, Vite, TypeScript, Tailwind CSS
apps/api   Java 21, Spring Boot 3, Maven, PostgreSQL, Flyway
infra      Docker Compose and container definitions
docs       Architecture, delivery plan, and operational notes
```

The browser application communicates with the backend exclusively through versioned REST endpoints under `/api/v1`. The backend is the authority for catalogue availability, prices, discounts, delivery fees, totals, order state, and stock. PostgreSQL is the system of record. Guest cart state is device-local until validation or checkout.

The first delivery is a vertical slice covering catalogue browsing, variant selection, cart management, server-side checkout quotation, cash-on-delivery ordering, and persisted WhatsApp ordering. Later slices extend the same domains with accounts and administration rather than replacing them.

## Frontend architecture

The Vite application uses feature-oriented modules:

- `app`: router, providers, application shell, error boundary.
- `features/catalog`: search, filtering, category browsing, product detail, variants.
- `features/cart`: local-storage cart, drawer, cart page, delivery progress.
- `features/checkout`: address form, quote, review, submission, duplicate protection.
- `features/orders`: confirmation and telephone-protected tracking.
- `features/auth`: optional customer sessions using HTTP-only cookies.
- `features/admin`: protected catalogue, order, customer, and settings screens.
- `components`: accessible primitives and composed shared UI.
- `i18n`: English and French dictionaries with a persistent language preference.
- `lib/api`: typed fetch client, correlation IDs, and consistent error mapping.

TanStack Query owns server state. React Hook Form and Zod own form state and validation. Cart state is kept in a focused context backed by local storage; no authentication material is stored there. Route-level lazy loading keeps the initial storefront bundle small.

## Visual system

CODAvenue uses the Investir Alia visual language without copying its real-estate content or branding:

- Cream canvas: `#F8F6F2`
- Deep navy: `#0F2347`
- Champagne accent: `#C89B3C`
- White surface: `#FFFFFF`
- Muted text: `#6B7280`
- Editorial headings: Cormorant Garamond
- Body and UI: Inter

These values become semantic CSS variables and Tailwind tokens instead of repeated literals. The storefront uses generous spacing, editorial typography, thin borders, restrained shadows, compact uppercase labels, and subtle motion. Admin screens share the palette but prioritize information density and keyboard operation.

## Backend module boundaries

The Spring Boot application is a modular monolith. Modules expose services and DTOs; persistence entities remain internal.

- `shared`: IDs, money, auditing, errors, correlation IDs, pagination.
- `settings`: store identity, currency, delivery rules, WhatsApp and support details.
- `category`: nested categories and attribute schemas.
- `brand`: brand catalogue.
- `catalog`: products, variants, images, specifications, search projections.
- `inventory`: stock reads and transactional stock movements.
- `customer`: guest identity snapshots, registered profiles, saved addresses.
- `checkout`: cart validation and authoritative quotes.
- `order`: order creation, status transitions, history, tracking, WhatsApp message generation.
- `auth`: cookie sessions, password hashing, CSRF and roles.
- `admin`: protected orchestration endpoints and dashboard projections.
- `delivery` and `promotion`: replaceable calculation policies used by checkout.

Dependencies point inward toward domain services. Controllers depend on application services; services depend on repository interfaces; infrastructure implements persistence and file storage. No module exposes JPA entities through REST.

## Database model

Core tables are `categories`, `brands`, `products`, `product_variants`, `product_images`, `store_settings`, `city_delivery_fees`, `customers`, `customer_addresses`, `orders`, `order_items`, `order_status_history`, `inventory_movements`, `users`, and `roles`.

Products store flexible specifications in PostgreSQL `jsonb`; variants store option values in `jsonb`. Order items snapshot product name, SKU, selected options, unit price, and totals so historical orders are unaffected by later catalogue edits. Monetary values use `numeric(19,2)` and are represented as `BigDecimal` in Java.

Every mutable aggregate carries timestamps and a version column. Product-variant rows are locked pessimistically during order confirmation to protect concurrent stock changes. Slugs, SKUs, order numbers, and relevant foreign-key/filter columns are indexed.

## Checkout and order flow

1. The client sends variant IDs and quantities, never trusted prices.
2. Checkout loads active variants, validates quantities and availability, applies current prices, calculates delivery from settings, and returns a short-lived quote.
3. Confirmation repeats validation inside a transaction and creates the order with `PENDING_CONFIRMATION`.
4. A unique order number uses `COD-YYYYMMDD-XXXXXX`, backed by a database sequence and uniqueness constraint.
5. Cash-on-delivery returns the confirmation resource.
6. WhatsApp ordering persists the order first, then returns a URL-encoded `wa.me` link assembled from the persisted snapshot.
7. An idempotency key prevents duplicate orders from repeated submissions.

`PaymentMethod` contains `CASH_ON_DELIVERY`, `WHATSAPP`, and `ONLINE_PAYMENT`. The final value is reserved for a future adapter and rejected by public checkout until enabled by a future capability flag.

## Inventory flow

`PENDING_CONFIRMATION` does not reserve or decrement stock. Transitioning to `CONFIRMED` locks all involved variants in a deterministic order, verifies every quantity, decrements stock, and records inventory movements atomically. Cancelling a confirmed order before shipment restores the same quantities once. Later invalid transitions are rejected by an explicit transition matrix. Every accepted transition appends order-status history with administrator identity and optional comment.

## Authentication and security

Guest checkout remains public. Customer and administrator sessions use opaque, server-managed HTTP-only cookies with `Secure` enabled outside development and `SameSite=Lax`. Passwords use BCrypt. Role checks protect `/api/v1/admin/**`; CSRF tokens protect cookie-authenticated mutations. Public login, order creation, and tracking endpoints are rate limited. Tracking requires both order number and normalized telephone number.

Uploads pass content-type, extension, size, and decoded-image validation. Development uses a local filesystem storage adapter; an S3-compatible adapter can implement the same interface later. Structured error responses contain timestamp, status, code, message, field errors, and correlation ID without leaking internals.

## Operational architecture

Docker Compose starts PostgreSQL, the API, and the web application. Flyway owns schema changes and development seed data is loaded only in the development profile. Health endpoints expose liveness and readiness. Logs are JSON in production and readable text in development. Secrets have no production defaults and are supplied through environment variables.

## Testing strategy

Important domain behavior is developed test-first. Pure unit tests cover money, delivery, transition rules, WhatsApp formatting, and frontend state. Spring integration tests with PostgreSQL Testcontainers cover persistence, locking, authorization, tracking privacy, and order workflows. React Testing Library covers pages and interactions; Playwright covers customer ordering and administrator order updates against the composed stack.

## Key decisions

1. React/Vite replaces the original Next.js request at the user's direction; SEO metadata and structured data are still rendered per route, but full server rendering is outside this Vite MVP.
2. The backend owns all financial and inventory decisions.
3. Orders snapshot commerce facts at creation time.
4. WhatsApp is an order source and customer handoff, not the database.
5. Modular-monolith boundaries preserve a path to growth without microservice overhead.
6. English is the default locale; French is selectable and persisted locally.

