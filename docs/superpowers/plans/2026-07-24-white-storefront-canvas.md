# White Storefront Canvas Implementation Plan

**Goal:** Make the main storefront canvas and header solid white without removing intentional dark brand sections.

1. Add a source-level regression test for the white canvas and preserved dark sections.
2. Change the global CSS and Tailwind `canvas` token to white.
3. Make the header background fully opaque white.
4. Run all tests, lint, and the production build.

