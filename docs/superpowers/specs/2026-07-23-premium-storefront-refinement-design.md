# Perle d'Orient Premium Storefront Refinement

## Objective

Refine the existing Perle d'Orient storefront so the catalogue controls and category presentation feel organized, restrained, and premium. The work preserves the approved ivory, deep burgundy, and antique-gold identity, the Inter typography, bilingual English/French behavior, and WhatsApp-only ordering.

## Design Direction

Use a balanced boutique layout with consistent geometry and generous negative space. Avoid masonry, uneven editorial card heights, ornamental frames, and heavy patterns. Visual richness should come from photography, proportion, typography, and controlled burgundy/gold accents.

## Header

- Keep the black delivery announcement bar.
- Preserve the Oriental Arch & Pearl logo and current primary navigation.
- Reduce unnecessary horizontal gaps and give the logo, navigation, language switch, search, and selection icon predictable alignment.
- Keep the header white, compact, and sticky with a subtle bottom border.
- Maintain a usable mobile navigation without compressing desktop labels.

## Home Category Section

- Present category cards in a balanced responsive grid: two columns on small screens, three columns on desktop.
- Every category card uses the same aspect ratio and height at a given breakpoint.
- Use five cards: Necklaces, Earrings, Bracelets, Rings, and Gift Sets.
- Apply a consistent burgundy-to-transparent lower gradient so mixed temporary photographs share one visual system.
- Place the category number, title, and arrow in identical positions on every card.
- Use restrained antique-gold numbering, white category titles, and a minimal outlined arrow control.
- Keep hover motion subtle: a small image scale and arrow color inversion only.

## Catalogue Filter Experience

- Replace the single row of raw form fields with a composed filter panel.
- First row: a wide search field with an integrated icon and a compact result count.
- Second row: category chips for All, Necklaces, Earrings, Bracelets, Rings, and Gift Sets.
- Right-side utility controls: a styled availability toggle and a compact sort menu.
- Selected chips use deep burgundy with ivory text; unselected chips use white or transparent ivory with a quiet border.
- All controls have consistent height, spacing, focus treatment, and bilingual labels.
- On mobile, controls wrap naturally and remain easy to tap without horizontal overflow.

## Product Grid

- Keep product cards aligned to a consistent image ratio.
- Use four columns on large screens, three on medium screens, and two on small screens.
- Maintain uniform vertical spacing between image, material/category metadata, title, and price.
- Avoid heavy card containers; use negative space and thin dividers where needed.

## Content and Localization

- Remove remaining generic commerce language from the touched sections.
- Catalogue filter labels, sorting options, empty state, and category names must display correctly in English and French.
- Correct all visible encoding issues in the touched components.
- Trust copy must continue to describe WhatsApp ordering only.

## Responsive and Accessibility Requirements

- Preserve keyboard focus indicators and meaningful accessible names.
- Use native controls where appropriate while visually integrating them into the premium toolbar.
- Category overlays must retain sufficient contrast over every photograph.
- No layout overflow at 320px width.

## Verification

- Add or update focused tests for translated catalogue labels and category selection behavior where pure helpers exist.
- Run the dependency-free Node test suite.
- Run ESLint with zero warnings.
- Run the production TypeScript/Vite build.
- Attempt a local visual smoke test at desktop and mobile widths; report any browser-runtime limitation rather than claiming visual verification without evidence.

## Scope Boundary

This refinement changes storefront presentation and related localized copy only. It does not change the WhatsApp order contract, backend product model, owner authentication, or product-management API.
