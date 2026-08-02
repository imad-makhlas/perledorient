# Perle d'Orient Transformation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform CODAvenue into the bilingual, WhatsApp-only Perle d'Orient premium-artisan jewelry boutique described in the approved specification.

**Architecture:** Preserve the React/Vite frontend and Spring Boot/PostgreSQL backend. Deliver the transformation as independent vertical slices: brand foundation, jewelry catalogue, WhatsApp-only order flow, product administration, and backend migration/API alignment. Preserve order history and stock rules while removing public customer-account and payment choices.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Node test runner, Spring Boot, Spring Data JPA, Flyway, PostgreSQL

## Global Constraints

- Customer-facing brand is `Perle d'Orient`; Java packages and the project directory remain unchanged.
- Palette values are ivory `#FFF9F0`, burgundy `#681F32`, dark burgundy `#40101F`, antique gold `#B8893D`, pale gold `#DEC69A`, warm ink `#2C2023`, muted `#75676A`, and border `#E9DDD2`.
- Inter weights 300 through 900 remain the only font family.
- Customer accounts, online payments, cash-on-delivery website selection, multiple admins, and image uploads are excluded.
- Customers complete orders through WhatsApp only.
- Existing orders and order history are never deleted.
- Product removal is implemented as deactivation.
- All changes remain uncommitted.

---

### Task 1: Brand contract, logo, and design tokens

**Files:**
- Modify: `apps/web/src/components/brand/brand.node.test.ts`
- Modify: `apps/web/src/components/brand/brand.ts`
- Modify: `apps/web/src/components/brand/Logo.tsx`
- Modify: `apps/web/src/index.css`
- Modify: `apps/web/tailwind.config.js`
- Modify: `apps/web/src/components/layout/Header.tsx`
- Modify: `apps/web/src/components/layout/Footer.tsx`
- Modify: `apps/web/src/components/layout/header-announcement.ts`

**Interfaces:**
- Produces: accessible Perle d'Orient full and mark-only logo variants; stable burgundy/ivory/gold Tailwind tokens.

- [ ] Change the brand tests to require `Perle d'Orient`, the compact `PO` label, and stable dark/light tone classes; run them and confirm failure against CODAvenue.
- [ ] Update brand constants and implement the Oriental Arch & Pearl SVG with dark, light, and mark-only modes.
- [ ] Replace navy/champagne visual tokens with the approved palette and update reusable buttons, fields, surfaces, header, announcement, and footer.
- [ ] Run the focused brand and typography tests and expect all tests to pass.

### Task 2: Jewelry catalogue and bilingual storefront

**Files:**
- Modify: `apps/web/src/data/products.ts`
- Modify: `apps/web/src/features/catalog/catalog.ts`
- Modify: `apps/web/src/features/catalog/catalog.node.test.ts`
- Modify: `apps/web/src/i18n/i18n.tsx`
- Modify: `apps/web/src/pages/HomePage.tsx`
- Modify: `apps/web/src/pages/CataloguePage.tsx`
- Modify: `apps/web/src/pages/ProductPage.tsx`
- Modify: `apps/web/src/components/product/ProductCard.tsx`
- Modify: `apps/web/src/pages/ContentPage.tsx`

**Interfaces:**
- Produces: five-family jewelry dataset; `Product` records with material, finish, dimensions, care, and handmade attributes; English/French customer interface.

- [ ] Update catalogue tests to require only Necklaces, Earrings, Bracelets, Rings, and Gift Sets, plus material-aware search; confirm failure against multi-category data.
- [ ] Replace the temporary catalogue with centralized jewelry images and product records designed for later photo replacement.
- [ ] Rewrite the translation dictionary with valid UTF-8 English/French Perle d'Orient copy and add every storefront key used by pages.
- [ ] Rebuild homepage, catalogue, product detail, cards, story, and navigation around the jewelry catalogue and craftsmanship positioning.
- [ ] Run catalogue and frontend Node tests and expect all tests to pass.

### Task 3: WhatsApp-only selection and order flow

**Files:**
- Modify: `apps/web/src/features/checkout/checkout-schema.node.test.ts`
- Modify: `apps/web/src/features/checkout/checkout-schema.ts`
- Create: `apps/web/src/features/checkout/whatsapp-order.node.test.ts`
- Create: `apps/web/src/features/checkout/whatsapp-order.ts`
- Modify: `apps/web/src/features/checkout/order-api.ts`
- Modify: `apps/web/src/pages/CartPage.tsx`
- Modify: `apps/web/src/pages/CheckoutPage.tsx`
- Modify: `apps/web/src/pages/ConfirmationPage.tsx`
- Modify: `apps/web/src/App.tsx`

**Interfaces:**
- Produces: `buildWhatsAppMessage(order): string`, `buildWhatsAppUrl(phone, message): string`, and a checkout schema whose payment method is always `WHATSAPP`.

- [ ] Change checkout tests to reject cash-on-delivery and accept WhatsApp-only guest details; confirm failure.
- [ ] Add tests for a Perle d'Orient message containing reference, jewelry lines, totals, and delivery details, and for correct URL encoding; confirm failure because the helper is absent.
- [ ] Implement the WhatsApp message helper and make `order-api.ts` use it for development fallback.
- [ ] Rename the cart UI to My selection, remove payment choices, submit `WHATSAPP`, open WhatsApp, and provide a copyable fallback on confirmation.
- [ ] Remove the public account route and account icon.
- [ ] Run checkout, selection, and cart tests and expect all tests to pass.

### Task 4: Backend brand and WhatsApp-only rules

**Files:**
- Modify: `apps/api/src/main/resources/application.yml`
- Create: `apps/api/src/main/resources/db/migration/V2__perle_d_orient_catalog.sql`
- Modify: `apps/api/src/main/java/com/codavenue/order/OrderService.java`
- Modify: `apps/api/src/main/java/com/codavenue/order/WhatsAppMessageBuilder.java`
- Modify: `apps/api/src/test-contract/java/com/codavenue/DomainContractTest.java`

**Interfaces:**
- Produces: Perle d'Orient order references and WhatsApp messages; backend rejects every payment method except `WHATSAPP`; forward-only jewelry seed migration.

- [ ] Add contract assertions for the Perle d'Orient message and WhatsApp-only payment policy; confirm failure against current backend behavior.
- [ ] Configure the store name, require `PaymentMethod.WHATSAPP`, and change generated references from `COD-` to `PDO-`.
- [ ] Add a Flyway migration that updates store settings, deactivates generic seed products, and inserts five jewelry categories plus jewelry product/variant samples without deleting orders.
- [ ] Compile and run the pure Java contract suite; expect exit code 0.

### Task 5: Owner product and stock API

**Files:**
- Create: `apps/api/src/main/java/com/codavenue/catalog/ProductEntity.java`
- Create: `apps/api/src/main/java/com/codavenue/catalog/ProductRepository.java`
- Create: `apps/api/src/main/java/com/codavenue/catalog/AdminProductService.java`
- Create: `apps/api/src/main/java/com/codavenue/catalog/AdminProductController.java`
- Modify: `apps/api/src/main/java/com/codavenue/catalog/ProductVariantEntity.java`
- Modify: `apps/api/src/main/java/com/codavenue/catalog/ProductVariantRepository.java`
- Modify: `apps/api/src/main/java/com/codavenue/catalog/CatalogController.java`
- Create: `apps/api/src/test-contract/java/com/codavenue/AdminProductContractTest.java`

**Interfaces:**
- Produces: `GET/POST /api/v1/admin/products`, `PUT /api/v1/admin/products/{id}`, `PATCH /api/v1/admin/products/{id}/active`, and `PATCH /api/v1/admin/products/{id}/variants/{variantId}/stock`.

- [ ] Add pure domain contract tests for non-negative price/stock, safe activation changes, and product-to-variant view mapping; confirm failure.
- [ ] Map the existing products table and extend variants with controlled update methods.
- [ ] Implement transactional service validation for unique slug/SKU, non-negative values, and deactivation instead of deletion.
- [ ] Expose owner endpoints under the already-protected `/api/v1/admin/**` boundary and aggregate active public catalogue responses.
- [ ] Run domain contracts and attempt Maven packaging, reporting any environment failure exactly.

### Task 6: Owner product workspace

**Files:**
- Create: `apps/web/src/features/admin/admin-products.node.test.ts`
- Create: `apps/web/src/features/admin/admin-products.ts`
- Create: `apps/web/src/pages/AdminProductsPage.tsx`
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/pages/AdminOrdersPage.tsx`

**Interfaces:**
- Consumes: Task 5 owner product endpoints and the existing `AdminCredentials` Basic Auth format.
- Produces: `/admin/products` list, search, create/edit form, stock adjustment, and activation controls.

- [ ] Add tests for request serialization, stock validation, and jewelry form defaults; confirm failure because the module is absent.
- [ ] Implement typed API helpers that reuse the owner credentials stored for order administration.
- [ ] Build the bilingual product workspace with search/filter, editor, stock controls, and deactivate/reactivate actions.
- [ ] Add navigation between Orders and Products within private admin pages.
- [ ] Run admin tests, TypeScript, and ESLint and expect exit code 0.

### Task 7: Final verification and stale-brand audit

**Files:**
- Modify only files revealed by verification failures.

**Interfaces:**
- Produces: verified Perle d'Orient frontend and backend source with no public CODAvenue/multi-category/account/payment-choice remnants.

- [ ] Search customer-facing source for `CODAvenue`, `Cash on delivery`, `Electronics`, `Automotive`, `Sports`, and `/account`; retain only explicitly internal compatibility names.
- [ ] Run all frontend Node tests and require zero failures.
- [ ] Run `npm run lint` in `apps/web` and require exit code 0.
- [ ] Run `npm run build` in `apps/web` and require TypeScript plus Vite exit code 0.
- [ ] Run backend pure Java contract tests and require exit code 0.
- [ ] Attempt Maven package; if permissions prevent packaging, report the exact failing path and error without claiming a successful package.
