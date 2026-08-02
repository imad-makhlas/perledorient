# Mobile and Tablet Bottom Navigation

## Goal

Replace the expandable mobile/tablet menu with a persistent, premium bottom navigation while preserving the compact brand header.

## Responsive behavior

- Mobile and tablet (`< 1024px`):
  - The top announcement remains unchanged.
  - The header keeps the Perle d’Orient logo, language switcher, search, and cart.
  - The hamburger button and expandable navigation are removed.
  - A fixed bottom navigation displays four destinations: Accueil/Home, Catalogue, Notre histoire/Our story, and Contact.
- Desktop (`>= 1024px`):
  - The existing horizontal header navigation remains visible.
  - The bottom navigation is hidden.

## Bottom navigation design

- Use a white background, a subtle top border, and a restrained shadow.
- Each destination contains a simple line icon and a short translated label.
- The active destination uses burgundy text with a small antique-gold indicator.
- The bar respects mobile safe-area insets and remains usable on narrow screens.
- Its stacking order stays above page content but below temporary overlays.

## Layout integration

- Add bottom spacing to the application shell on mobile/tablet so the fixed bar never covers page content or footer links.
- Move the floating WhatsApp button above the bottom navigation on mobile/tablet.
- Keep the current WhatsApp position on desktop.
- Search continues to open the catalogue and cart continues to display its item count.

## Components

- `Header`: retains compact brand controls and desktop navigation; removes mobile menu state and hamburger UI.
- `MobileBottomNavigation`: owns the four mobile/tablet links, icons, localization, and active-route styling.
- `App`: renders the bottom navigation and reserves the required bottom space.

## Accessibility

- Use a semantic `nav` with a localized accessible label.
- Keep visible text labels rather than icon-only controls.
- Mark the current destination with `aria-current="page"`.
- Ensure touch targets are at least 44 pixels high.

## Verification

- Component/source tests verify that the hamburger menu is gone, header controls remain, and the bottom navigation contains all four links.
- Route tests verify active-link behavior, including nested catalogue and product routes.
- Responsive CSS/class assertions verify that the bottom navigation is hidden on desktop and that content/WhatsApp spacing accounts for the fixed bar.
- Run the complete test suite, lint, and production build.
