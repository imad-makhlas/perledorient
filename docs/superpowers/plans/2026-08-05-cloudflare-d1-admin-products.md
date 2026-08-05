# Cloudflare D1 Admin Products Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Cloudflare D1-backed admin product APIs for Perle d'Orient without R2 uploads.

**Architecture:** Cloudflare Pages Functions expose product admin endpoints under `/api/v1/admin/products`. D1 stores one editable row per product variant, seeded from the existing local catalogue shape. The existing React admin page keeps using its current client API.

**Tech Stack:** React/Vite/Tailwind, Cloudflare Pages Functions, Cloudflare D1, TypeScript, Vitest, Playwright.

## Global Constraints

- D1 database binding: `DB`
- D1 database name: `perle-dorient-db`
- D1 database id: `b43831ac-d287-41ba-8817-1c8eb7bddfad`
- Admin email env var: `ADMIN_EMAIL`
- Admin password env var: `ADMIN_PASSWORD`
- No R2 integration for now; product images remain URL/path strings.
- Keep existing admin UI behavior and routes.

---

### Task 1: Cloudflare Config And D1 Migration

**Files:**
- Create: `wrangler.jsonc`
- Create: `migrations/0001_create_admin_products.sql`

**Interfaces:**
- Produces D1 binding `DB` for Pages Functions.
- Produces table `admin_products`.

- [ ] **Step 1: Create Wrangler config**

Create `apps/web/wrangler.jsonc` with D1 binding and Pages output.

- [ ] **Step 2: Create D1 migration**

Create `admin_products` with columns matching `AdminProduct`.

- [ ] **Step 3: Verify config syntax**

Run `npm run build` in `apps/web`.

### Task 2: Admin Auth And Product API Helpers

**Files:**
- Create: `functions/api/v1/admin/_shared.ts`
- Test: `apps/web/src/features/admin/admin-products.node.test.ts`

**Interfaces:**
- Produces `requireAdmin(request, env)` for Basic Auth.
- Produces D1 row mapping helpers.

- [ ] **Step 1: Write tests for admin product payload trimming**

Keep existing payload tests passing.

- [ ] **Step 2: Implement shared helper**

Validate Basic Auth against `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

### Task 3: Admin Product List And Update Functions

**Files:**
- Create: `functions/api/v1/admin/products/index.ts`
- Create: `functions/api/v1/admin/products/[id].ts`

**Interfaces:**
- `GET /api/v1/admin/products` returns `AdminProduct[]`.
- `PATCH /api/v1/admin/products/:id` returns updated `AdminProduct`.

- [ ] **Step 1: Add a failing E2E/API expectation if possible**

Verify admin list/update route exists in deployed-compatible Functions shape.

- [ ] **Step 2: Implement GET**

Read rows from D1 sorted by product name and SKU.

- [ ] **Step 3: Implement PATCH**

Validate editable fields and update one row.

- [ ] **Step 4: Verify**

Run lint, build, and relevant tests.
