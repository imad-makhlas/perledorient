# Catalogue Filter Redesign

Date: 2026-07-24  
Status: Approved visual direction

## Goal

Replace the current boxed catalogue filter panel with a compact editorial toolbar that feels appropriate for a premium artisan jewelry boutique.

## Approved Direction

Use visual direction A, “Ruban éditorial.”

The toolbar should feel calm and refined rather than administrative. It will use white space, thin horizontal rules, the existing ivory, deep burgundy, and antique-gold palette, and the existing Perle d’Orient typography.

## Desktop Layout

1. A small collection label sits on the left.
2. The current result count sits on the right.
3. A full-width search field appears below, styled primarily with a bottom rule rather than a surrounding box.
4. The final row contains:
   - category tabs on the left;
   - an availability switch on the right;
   - one compact custom sort trigger showing the active label, such as “Nos favoris.”
5. The active category uses burgundy text and a burgundy underline.
6. The sort choices open in a small floating menu beneath the trigger. Only one choice is visible before opening the menu.

## Mobile Layout

1. The label and result count remain on one compact row.
2. Search remains full width.
3. Category tabs form a horizontally scrollable strip.
4. Availability and sorting share a compact row below the category strip.
5. The toolbar must not introduce horizontal page overflow or a tall stack of filter buttons.

## Interaction

- Search updates the product grid as the customer types.
- Clicking a category immediately filters the grid.
- The availability switch toggles in-stock products.
- Clicking the sort trigger opens or closes the custom menu.
- Choosing a sort option updates the products and closes the menu.
- Clicking outside the sort menu or pressing Escape closes it.
- The active sort option is identified visually and with accessible state.
- Existing French and English labels remain supported.

## Visual Rules

- Remove the large surrounding panel effect and the grid of sort buttons.
- Avoid pill-heavy styling on desktop.
- Use borders only as quiet separators.
- Keep burgundy for active states, antique gold for small accents, and ivory for subtle hover or menu surfaces.
- Preserve comfortable touch targets and visible keyboard focus.

## Accessibility

- The sort trigger is a button with `aria-expanded` and `aria-haspopup`.
- Sort options are keyboard reachable.
- The availability control retains a real checkbox.
- Category controls retain button semantics and an accessible selected state.
- Focus treatment must remain visible against white and ivory surfaces.

## Verification

- Unit tests cover localized sorting labels and filter behavior.
- Build and lint complete successfully.
- Browser checks cover French and English at desktop and 320 px mobile widths.
- Browser checks confirm the old “Sélection” text and native select element are absent.
- Browser checks confirm there is no horizontal page overflow.

