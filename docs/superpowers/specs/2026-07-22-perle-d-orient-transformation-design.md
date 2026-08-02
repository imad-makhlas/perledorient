# Perle d'Orient Transformation Design

## Objective

Transform the existing CODAvenue multi-category commerce application into **Perle d'Orient**, a bilingual premium-artisan boutique for handcrafted jewelry inspired by oriental design. Customers browse and prepare a selection without creating an account, then complete the order through WhatsApp. One private owner account manages products, stock, and order follow-up.

## Product Positioning

Perle d'Orient offers elegant handmade jewelry at accessible premium prices. The brand should feel refined, warm, personal, and rooted in craftsmanship. It must avoid both generic marketplace language and highly formal luxury positioning.

Primary product families are:

- Necklaces
- Earrings
- Bracelets
- Rings
- Gift sets

## Brand System

### Name and identity

All customer-facing CODAvenue references become **Perle d'Orient**. Internal Java package names and filesystem paths remain unchanged in this transformation to avoid a risky, unrelated technical rename.

### Logo

The new logo is an original code-native SVG named **Oriental Arch & Pearl**. A refined pointed oriental arch frames one pearl. The full lockup pairs the mark with the Perle d'Orient wordmark; a compact mark supports mobile navigation, favicons, packaging stamps, and social avatars.

Required variants:

- Dark: burgundy linework and antique-gold pearl on ivory or white
- Light: ivory linework and antique-gold pearl on burgundy
- Mark-only: the arch and pearl without the wordmark

The SVG must remain legible at 32 pixels, use no raster dependency, and expose an accessible brand label.

### Color palette

- Ivory background: `#FFF9F0`
- Deep burgundy: `#681F32`
- Dark burgundy: `#40101F`
- Antique gold: `#B8893D`
- Pale gold: `#DEC69A`
- Warm ink: `#2C2023`
- Muted text: `#75676A`
- Warm border: `#E9DDD2`
- White remains available for product cards and photography presentation.

The delivery announcement remains a narrow dark strip but uses dark burgundy rather than black so it belongs to the new identity.

### Typography

Inter remains the only application font, with weights 300 through 900. Large headings use tighter tracking and strong weight rather than the removed Investir Alia serif style. Navigation, buttons, prices, labels, and body copy also use Inter.

## Customer Experience

### Navigation

Primary navigation becomes:

- Shop
- Necklaces
- Earrings
- Bracelets
- Rings
- Our story

The language control remains English/French. The customer account link and route are removed. Search, selection/cart, and WhatsApp access remain.

### Homepage

The homepage introduces the brand through craftsmanship rather than multi-category commerce. It contains:

1. Ivory hero with the new logo language, a jewelry-focused headline, one primary shop action, and one craftsmanship/story action.
2. Product-family grid for necklaces, earrings, bracelets, rings, and gift sets.
3. Featured jewelry selection.
4. Craftsmanship story covering handmade work, oriental inspiration, and small-series production.
5. Trust row for delivery across Morocco, direct WhatsApp assistance, and careful presentation or gift-ready packaging.
6. WhatsApp call-to-action instead of an email newsletter.

Temporary jewelry photographs may use remote URLs. Every temporary image stays centralized in product data so the owner can replace it later without editing page components.

### Catalogue and product detail

The catalogue exposes jewelry-specific filters and product information. Products contain:

- Name and category
- Price and optional comparison price in MAD
- Main image and optional gallery
- Material
- Finish or color
- Dimensions or adjustable size
- Care guidance
- Handmade or small-series indicator
- Available quantity

The former brand field is no longer shown as a third-party brand. It may be repurposed internally as the collection name during migration, while Perle d'Orient is the store brand.

### Selection and WhatsApp ordering

The existing cart becomes **My selection**. It stores chosen jewelry, finish or size variant, quantity, and price. The only completion action is **Order on WhatsApp**.

The customer supplies:

- Name
- Telephone
- City
- Delivery address
- Optional note

Submitting the form creates or preserves an internal order snapshot, then opens a URL-encoded WhatsApp message containing:

- Perle d'Orient greeting
- Order reference
- Each product, variant, quantity, and line total
- Total in MAD
- Customer and delivery details
- Request for availability and delivery confirmation

No online payment, cash-on-delivery selector, customer authentication, or customer account dashboard remains. Payment and final confirmation happen in the WhatsApp conversation.

If WhatsApp cannot open, the page retains the order reference and shows a copyable formatted message plus the shop telephone number.

## Owner Administration

The application has one owner account configured through backend environment values. Public registration, multiple administrators, roles management, and customer authentication are out of scope.

### Product management

The private `/admin/products` workspace supports:

- Search and category filtering
- Create jewelry
- Edit customer-facing information
- Manage price and optional comparison price
- Manage material, finish, dimensions, care, and collection
- Manage variant SKU and stock
- Set featured and new-arrival flags
- Set temporary or final image URLs
- Activate or deactivate a product

Products and variants referenced by orders are never hard-deleted. Deactivation removes them from the public catalogue while preserving historical order data.

### Order management

The existing order workspace remains private and is adapted to WhatsApp-only orders. The owner can review customer details, open the WhatsApp conversation, and move an order through confirmation, preparation, shipment, delivery, cancellation, or return.

Stock reservation remains tied to confirmed orders rather than an initial WhatsApp request. Cancellation restores stock only when it had been reserved.

## Data and Migration

The existing Spring Boot and PostgreSQL architecture remains. A new Flyway migration updates store settings and seeds jewelry-oriented categories and sample data without rewriting the original migration.

The implementation adds product-level persistence mappings for the existing `products`, `categories`, `brands`, and `product_images` tables as required. Product variants remain the stock authority.

Existing development seed products may be deactivated or replaced by jewelry sample records through a forward migration. Production-safe migrations do not delete orders, order items, or status history.

## API Boundaries

Public catalogue endpoints expose active jewelry and aggregate its variants and images into product-level responses.

Owner endpoints live under `/api/v1/admin/**` and remain protected by the existing owner authentication mechanism. Required operations are:

- List products with inactive products included
- Create product and initial variant
- Update product and variants
- Adjust stock with non-negative validation
- Activate or deactivate product
- List and update WhatsApp-originated orders

Validation errors return structured API errors. Duplicate slugs or SKUs return conflict responses. Missing products return not-found responses. Invalid negative prices or stock return validation responses.

## Bilingual Content

All primary navigation, calls to action, headings, catalogue controls, selection flow, WhatsApp order form, empty states, and error messages support English and French. Hardcoded customer-facing English strings are moved into the existing translation system during the transformation.

Product content remains entered once in the initial administration slice. Fully localized product titles and descriptions are a later optional enhancement and are not required for this transformation.

## Testing and Acceptance Criteria

The transformation is complete when:

- No customer-facing CODAvenue or multi-category marketplace language remains.
- The Oriental Arch & Pearl logo renders in dark, light, full, and mark-only variants.
- The active palette uses ivory, burgundy, and antique gold.
- Inter remains the only imported font.
- Public navigation contains no customer account link.
- Catalogue data contains only the five approved jewelry families.
- A customer can add jewelry to My selection and generate a correctly encoded WhatsApp order.
- The WhatsApp fallback preserves a copyable order message.
- One owner can create, edit, stock, feature, and deactivate jewelry.
- Deactivated products are absent publicly but visible in admin.
- Confirmed orders reserve stock and eligible cancellation restores it.
- English and French interface tests pass.
- Frontend Node tests, TypeScript compilation, ESLint, and Vite production build pass.
- Backend domain contract tests pass; Maven packaging is attempted and any environment-specific failure is reported exactly.

## Out of Scope

- Customer accounts
- Customer registration or login
- Online card payments
- Cash-on-delivery selection in the website
- Multiple owner or staff accounts
- Role-management UI
- Direct image uploads or media storage
- Category and collection administration
- Localized product records
- Repackaging Java namespaces or renaming the project directory
