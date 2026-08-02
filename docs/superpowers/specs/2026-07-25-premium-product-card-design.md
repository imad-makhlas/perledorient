# Premium Product Card Redesign

## Goal

Redesign the catalogue product card so its lower information area feels premium, organized, and immediately readable, especially for size, price, and availability.

## Card structure

1. Product image with the existing discount/new badges and subtle hover zoom.
2. White editorial information panel.
3. Material eyebrow in antique gold.
4. Product name with a refined display hierarchy and arrow affordance.
5. Dedicated dimensions/size row.
6. Separated price and availability footer.

## Dimensions data

- Add an optional `dimensions?: string` field to `ProductSummary`.
- Populate it from the existing jewelry seed dimensions such as `45 cm chain`, `Adjustable size`, and `3.2 cm drop`.
- Display it with a small ruler icon and the localized prefix:
  - English: `Size`
  - French: `Taille`
- Omit the row gracefully when no dimensions value exists.

## Typography and spacing

- Material: 10 pixels on mobile and 11 pixels from `sm`, with restrained tracking.
- Product name: approximately 19 pixels on mobile and 22 pixels from `sm`.
- Dimensions: 11–12 pixels with a clearly visible muted tone.
- Current price: 15–16 pixels and semibold.
- Comparison price: at least 12 pixels.
- Availability: 10 pixels minimum with reduced tracking.
- Increase panel padding and use a consistent minimum height so cards align within the grid.

## Availability badge

- Replace the tiny standalone uppercase text with a soft pill badge.
- Include a small colored status dot.
- Available: restrained emerald tone.
- Low stock: warm amber tone.
- Unavailable: burgundy/red tone.
- Keep the existing localized status labels.

## Premium interaction

- Add a thin neutral border around the full card.
- Add a subtle shadow and small upward translation on hover.
- Keep image zoom restrained.
- Avoid a permanent commerce button so the card remains editorial and uncluttered.

## Responsive behavior

- Maintain the existing two-column mobile, three-column tablet, and four-column desktop grids.
- On narrow cards, stack the availability badge below the price if needed.
- From `sm`, align price and availability horizontally.
- Preserve equal visual rhythm across cards with and without discounts.

## Verification

- Add source tests for the dimensions field and seed mapping.
- Add source tests for readable typography, size row, status dot/pill, border, and hover treatment.
- Verify the dimensions row is conditional.
- Run all source tests, Vitest, lint, and the production build.
