# Compact Mobile Wordmark

## Goal

Display the complete Perle d’Orient identity in the mobile and tablet header without crowding the language, search, and cart controls.

## Design

- Keep the oriental arch-and-pearl mark on the left.
- Display “Perle d’Orient” beside it at every viewport width.
- Preserve the antique-gold color on “Orient”.
- Keep the small “Bijoux artisanaux” signature below the name.
- Use a dedicated compact logo presentation below the `sm` breakpoint and retain the current full-size logo from `sm` upward.

## Compact sizing

- Reduce the mobile mark from 44 pixels to approximately 36 pixels.
- Use an approximately 18-pixel wordmark with tight premium spacing.
- Use a 6-pixel uppercase signature with restrained tracking.
- Reduce the gap between the mark and wordmark so the complete identity fits alongside the three header utilities.

## Responsive behavior

- The complete brand name must remain visible on narrow mobile screens.
- Language, search, and cart controls must remain visible and usable.
- The existing tablet and desktop wordmark stays unchanged.
- The desktop primary navigation and the fixed mobile/tablet bottom navigation remain unchanged.

## Verification

- Add a source test proving that the narrow header uses the complete compact logo instead of `markOnly`.
- Verify that the compact presentation contains both the wordmark and artisan signature.
- Run all source tests, Vitest, lint, and the production build.
