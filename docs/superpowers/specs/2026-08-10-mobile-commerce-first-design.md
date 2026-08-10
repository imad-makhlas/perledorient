# Mobile Commerce-First Storefront

## Goal

Make the mobile storefront feel like a focused, premium e-commerce experience: products appear immediately, product information is easier to scan, and each product page exposes one clear purchase action without competing controls.

## Design principles

- Prioritize products and purchase decisions over introductory or instructional content.
- Show only one persistent purchase surface at a time.
- Keep the existing warm white, charcoal, burgundy, and antique-gold visual language.
- Preserve the current desktop composition unless a typography adjustment is explicitly specified below.
- Respect device safe areas and the existing fixed bottom navigation.

## Catalogue and product cards

- Product cards remain self-contained and do not trigger a page-level sticky purchase bar.
- The catalogue, home page, and related-product sections never display the product-page sticky bar.
- Cards keep a concise hierarchy: image, material, product name, dimensions when present, price, availability, and the existing card-level action where applicable.
- A card action must remain visually secondary to the product-page purchase action and must not overlap the bottom navigation.

## Product page header and description

- Reduce the mobile product title from its current oversized treatment to approximately 28–30 pixels with compact, readable line-height.
- Retain the larger editorial title scale from the tablet/desktop breakpoint.
- Remove the duplicated descriptive paragraph from the purchase summary on mobile.
- Keep the complete product description in the details section only.
- Present the description section as a closed accordion by default so price, variants, and purchase controls remain the initial focus.
- Keep material, price, previous price, availability, and product reference immediately scannable above the fold.

## Mobile product purchase bar

- Render the sticky purchase bar only on a product-detail route and only below the desktop breakpoint.
- Position it directly above the existing mobile bottom navigation, including the device safe-area offset.
- Use a compact white surface with a subtle border/shadow that is visually separate from both page content and navigation.
- Provide exactly two actions:
  - A compact cart button with an accessible label and a touch target of at least 44 pixels.
  - A dominant antique-gold `Commander` / `Order` button that starts the existing direct-order flow.
- Do not repeat the product name in the sticky bar. The reduced information density keeps both actions usable on narrow phones.
- Preserve price and variant selection in the page content; the sticky bar is an action surface, not a second product summary.
- Disable or clearly communicate the purchase action when no variant is available.
- Ensure the bar does not appear on the catalogue, home page, cart, checkout, story, or contact routes.

## Mobile home page

- Hide the current introductory hero on mobile so the page begins with products after the global header.
- Keep the hero available on tablet/desktop, where its editorial composition has sufficient space.
- Replace the mobile horizontal swipe rail with a single-column vertical list of product cards.
- Display cards one below another at full available width, with consistent spacing and no partially visible neighboring card.
- Keep a short collection heading only if it helps orientation; avoid explanatory copy before the first product.
- Hide the instructional `Comment commander ?` section on mobile. It may remain later in the desktop experience.
- Keep trust, craftsmanship, and story content after the products so it supports rather than delays shopping.

## Responsive boundaries

- Mobile commerce-first behavior applies below the project’s tablet/desktop content breakpoint.
- At larger breakpoints, retain the current hero, product grid/rail behavior, inline purchase controls, and instructional content unless required for consistency.
- The mobile title adjustment must not reduce the established desktop title size.
- The sticky purchase bar and bottom navigation must never overlap at 320-pixel viewport width or with safe-area insets enabled.

## Accessibility and interaction

- Keep visible text on the primary order action.
- Provide an accessible name for the icon-only cart action.
- Maintain logical keyboard focus order and visible focus styles.
- Ensure fixed elements do not hide the final page content; reserve sufficient bottom padding on product pages.
- Avoid layout shifts when the sticky bar mounts.

## Verification

- Add route/component tests proving the sticky purchase bar appears on product-detail routes only.
- Verify the bar contains one cart action and one direct-order action, without a repeated product title.
- Verify the product description is rendered once and its accordion is closed by default.
- Verify the mobile title scale and unchanged desktop title scale.
- Verify the mobile home page hides the hero and instructional section, and uses a one-column vertical product list.
- Verify desktop still shows the editorial hero and its existing multi-column product presentation.
- Add a narrow mobile viewport check confirming that the purchase bar sits above, and does not overlap, the bottom navigation.
- Run source tests, Vitest, lint, and the production build.

## Out of scope

- Changing checkout or WhatsApp order business logic.
- Redesigning the global header or bottom navigation.
- Removing editorial content from the desktop storefront.
- Changing product data, prices, inventory, or translations beyond labels needed by this refinement.
