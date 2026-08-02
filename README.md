# CODAvenue

CODAvenue is a premium, bilingual English/French commerce platform for Morocco. It uses the visual language of the Investir Alia project—cream canvas, deep navy, champagne accents, editorial serif headings, and restrained interaction—while introducing an original multi-category retail identity.

This repository currently contains the first runnable vertical slice: premium storefront, catalogue search/filter/sort, product variants, persistent guest cart, validated delivery checkout, authoritative backend totals, cash-on-delivery orders, persisted WhatsApp orders, protected tracking, PostgreSQL migrations, and seeded catalogue data.

## Architecture

```text
apps/
  web/  React 19 + Vite + strict TypeScript + Tailwind CSS
  api/  Java 21 + Spring Boot 3.4 + JPA + Security + Flyway
infra/  Docker Compose
docs/   architecture, implementation plan, and OpenAPI contract
```

The frontend never sends trusted prices. It submits variant IDs and quantities; the API loads current variants, validates stock, calculates line totals and delivery fees, and persists an immutable order snapshot. WhatsApp orders are stored before the API returns the encoded `wa.me` URL.

See [architecture.md](docs/architecture.md) and [implementation-plan.md](docs/implementation-plan.md) for boundaries and remaining delivery phases.

## Requirements

- Node.js 22+
- npm 10+
- Java 21
- Maven 3.9+
- PostgreSQL 16+ or Docker with Compose

## Environment variables

Copy `.env.example` to `.env` and set environment-specific values. Never use development passwords in production.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | JDBC PostgreSQL URL |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD` | Database credentials |
| `JWT_SECRET` | Reserved for the secured account phase; no production default |
| `APP_BASE_URL` | Allowed storefront origin |
| `API_BASE_URL` / `VITE_API_BASE_URL` | Backend URL for clients |
| `STORE_NAME` / `STORE_CURRENCY` | Store identity and currency |
| `STORE_WHATSAPP_NUMBER` | International digits without `+` for `wa.me` |
| `STORE_SUPPORT_PHONE` / `STORE_SUPPORT_EMAIL` | Customer support details |
| `FREE_DELIVERY_THRESHOLD` | Backend free-delivery threshold |
| `DEFAULT_DELIVERY_FEE` | Backend fallback delivery fee |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Development administrator account; password is mandatory for Compose |
| `UPLOAD_DIRECTORY` | Local image storage path for the media phase |

## Local installation

### Frontend

```powershell
npm.cmd install
npm.cmd --prefix apps/web run dev
```

Open `http://localhost:5174`. Vite proxies `/api` to `http://localhost:8080`.

On locked-down Windows workspaces, Vite may be unable to create `node_modules/.vite`. Use an external cache directory:

```powershell
$env:VITE_CACHE_DIR="$env:TEMP\codavenue-vite-cache"
npm.cmd --prefix apps/web run dev
```

### Backend

Create a PostgreSQL database named `codavenue`, export the variables from `.env`, then run:

```powershell
cd apps/api
mvn spring-boot:run
```

The API starts on `http://localhost:8080`; health is available at `/api/v1/health`.

## Docker installation

Set `ADMIN_PASSWORD` in `.env`, then:

```powershell
docker compose --env-file .env -f infra/docker-compose.yml up --build
```

The storefront is exposed at `http://localhost:3000`, the API at `http://localhost:8080`, and PostgreSQL at `localhost:5432`.

## Database migrations and seed data

Flyway runs automatically when the API starts. `V1__commerce_foundation.sql` creates the category, brand, product, variant, image, settings, order, item, and status-history foundations and seeds:

- 6 top-level categories
- 8 brands
- 30 multi-category products and variants
- in-stock, low-stock, and out-of-stock examples
- MAD delivery settings, including Casablanca pricing and the 500 MAD threshold

For a clean development database, stop the stack and remove only the named Compose volume:

```powershell
docker compose -f infra/docker-compose.yml down -v
```

This deletes the local Compose database volume.

## Running tests and builds

```powershell
# Dependency-free frontend domain tests used in restricted environments
node --experimental-strip-types --test apps/web/src/features/cart/cart.node.test.ts apps/web/src/features/catalog/catalog.node.test.ts apps/web/src/features/checkout/checkout-schema.node.test.ts

# Standard frontend suite after npm installation
npm.cmd --prefix apps/web run test
npm.cmd --prefix apps/web run typecheck
npm.cmd --prefix apps/web run lint
npm.cmd --prefix apps/web run build
npm.cmd --prefix apps/web run test:e2e

# Backend
cd apps/api
mvn test
mvn verify
```

The dependency-free Java domain contract can be compiled without Maven; it verifies delivery, totals, transitions, and WhatsApp encoding. Standard development and CI should run the JUnit suite with Maven.

## Demo administrator access

Spring Security creates a development administrator using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. The default email is `admin@codavenue.local`; choose the password explicitly. Do not expose the development account publicly. The protected order operations UI is available at `/admin/orders`; broader product, inventory, settings, and customer CRUD workflows remain scheduled in the implementation plan.

## Configuring WhatsApp

Set `STORE_WHATSAPP_NUMBER` to the destination number in international format using digits only, for example `212600000000`. The API generates a URL-encoded message from the persisted order snapshot. The customer confirmation page preserves a fallback link if automatic opening is blocked.

## Configuring delivery fees

Development defaults are 30 MAD for Casablanca, 45 MAD for other cities, and free delivery from 500 MAD. Environment variables configure the service-level defaults. The `store_settings` and `city_delivery_fees` tables are the foundation for the protected settings UI in the administration phase.

## API documentation

The versioned contract is in [openapi.yaml](docs/openapi.yaml). Public endpoints currently include catalogue variants, order creation, secure order tracking, and health.

## Production considerations

- Replace all development credentials and supply secrets through the deployment environment.
- Serve the storefront and API over HTTPS; secure-cookie account authentication arrives with the account phase.
- Restrict CORS to the production storefront origin.
- Run PostgreSQL with backups, encryption, monitoring, and a least-privilege application user.
- Place uploaded media in S3-compatible object storage when the storage adapter is enabled.
- Add rate limiting at the edge and application layer for login, ordering, and tracking.
- Run Maven, Vitest, Playwright, lint, type checking, and both production builds in CI.
- Keep `ONLINE_PAYMENT` disabled until a separately reviewed payment adapter is implemented.

## Delivery status

Completed in the current vertical slice:

- Original responsive CODAvenue storefront using the Investir Alia color and typography system
- English/French language switching
- Homepage, catalogue, product details, variants, cart, checkout, confirmation, and core content routes
- COD and WhatsApp order creation with backend-owned totals
- PostgreSQL Flyway foundation with 30 seeded products
- Order status transition policy and WhatsApp message contract tests
- Dockerfiles, Compose, environment example, architecture, implementation plan, and OpenAPI contract

The remaining phases are explicitly tracked in `docs/implementation-plan.md`: transactional admin stock confirmation/cancellation, complete administrator CRUD and dashboard, optional customer accounts, media uploads, full content/policy localization, rate limiting, Testcontainers, and the complete Playwright matrix. The project should not be described as satisfying the final definition of done until those phases and their tests are complete.
