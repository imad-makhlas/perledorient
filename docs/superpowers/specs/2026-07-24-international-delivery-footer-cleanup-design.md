# International Delivery Copy and Footer Cleanup

## Goal

Communicate delivery in Morocco and internationally without implying that the Moroccan complimentary-delivery threshold applies abroad, and simplify the footer contact block.

## Footer cleanup

- Remove the e-mail row.
- Remove the Casablanca, Morocco location row.
- Keep the telephone row.
- Keep the linked Instagram row.
- Remove unused `Mail` and `MapPin` icon imports.

## Delivery messaging

### Announcement bar

- English: `Complimentary delivery from 500 MAD in Morocco - International delivery available`
- French: `Livraison offerte dès 500 MAD au Maroc - Livraison internationale disponible`

### Footer description

- Replace the Morocco-only sentence with a sentence stating that small-series jewelry is delivered in Morocco and internationally.

### Trust copy

- English: `Delivery in Morocco & worldwide`
- French: `Livraison au Maroc et à l’international`
- Update both active Perle d’Orient copy and matching legacy copy so no storefront fallback retains Morocco-only wording.

### Delivery information pages

- Keep the existing Moroccan fees: 30 MAD in Casablanca, 45 MAD in other Moroccan cities, complimentary from 500 MAD.
- Add that international delivery fees and timing are confirmed through WhatsApp according to destination.
- Update both delivery content maps that currently contain Morocco-only wording.

### Homepage badge

- Replace the standalone `Morocco` delivery-oriented badge with `Morocco & worldwide`.

## Scope boundaries

- Do not change Casablanca test fixtures, example addresses, or order data.
- Do not change the current Moroccan delivery-fee calculation.
- Do not add country selectors or fixed international rates.
- International orders continue to be confirmed through WhatsApp.

## Verification

- Add tests for the exact bilingual announcement text.
- Add source tests proving the footer no longer contains e-mail or location details.
- Verify all active and legacy delivery marketing copy includes international delivery.
- Verify delivery policy text distinguishes Moroccan fixed fees from international WhatsApp confirmation.
- Run all source tests, Vitest, lint, and the production build.
