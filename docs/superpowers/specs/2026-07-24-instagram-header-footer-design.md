# Instagram Link in Header and Footer

## Goal

Add a consistent Instagram entry point to the site header and footer using the official account `https://instagram.com/ma.perle.dorient`.

## Header

- Add the Lucide Instagram icon after the cart icon.
- Display it on mobile, tablet, and desktop.
- Open the Instagram profile in a new tab with safe external-link attributes.
- Use the accessible label “Instagram Perle d’Orient”.
- Keep the icon visually consistent with the existing search and cart controls.
- Tighten utility spacing below `sm` only as needed to preserve the complete compact logo without horizontal overflow.

## Footer

- Replace the plain `@perledorient` text with a linked Instagram row.
- Use the antique-gold Instagram icon followed by `@ma.perle.dorient`.
- Match the existing phone, email, and location row styling.
- Open the profile in a new tab with safe external-link attributes.

## Responsive behavior

- Keep the complete mobile wordmark, language switcher, search, cart, and Instagram visible.
- Preserve the existing tablet and desktop header layout.
- Do not change the fixed bottom navigation.

## Verification

- Add source tests for the exact Instagram URL in both header and footer.
- Verify both links use `target="_blank"` and `rel="noreferrer"`.
- Verify the header exposes the accessible label and the footer shows `@ma.perle.dorient`.
- Run all source tests, Vitest, lint, and the production build.
