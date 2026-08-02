# CODAvenue Avenue Luxe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade CODAvenue's visual identity with a premium logo and Avenue Luxe storefront styling.

**Architecture:** Add reusable brand primitives, then apply them across layout and product surfaces. Keep behavior unchanged except for accessible logo labels and visual states.

**Tech Stack:** React, Vite, Tailwind CSS, lucide-react, TypeScript.

## Global Constraints

- Work only in `C:\Imad Makhlas\projects\codavenue`.
- Use code-native SVG for the logo.
- Do not add new runtime dependencies.
- Keep existing API routes and commerce behavior unchanged.

---

### Task 1: Brand Primitive

**Files:**
- Create: `apps/web/src/components/brand/brand.ts`
- Create: `apps/web/src/components/brand/Logo.tsx`
- Test: `apps/web/src/components/brand/brand.node.test.ts`

- [ ] Write a failing node test for brand labels and logo tone classes.
- [ ] Add brand helper functions and reusable logo component.
- [ ] Run the node test and TypeScript.

### Task 2: Premium Storefront Styling

**Files:**
- Modify: `apps/web/src/index.css`
- Modify: `apps/web/tailwind.config.js`
- Modify: `apps/web/src/components/layout/Header.tsx`
- Modify: `apps/web/src/components/layout/Footer.tsx`
- Modify: `apps/web/src/pages/HomePage.tsx`
- Modify: `apps/web/src/components/product/ProductCard.tsx`
- Modify: `apps/web/src/pages/CataloguePage.tsx`
- Modify: `apps/web/src/pages/AdminOrdersPage.tsx`

- [ ] Add richer global tokens and reusable surface classes.
- [ ] Replace text logo usages with the logo component.
- [ ] Refine homepage, product, category, catalogue, footer, and admin surfaces.
- [ ] Run lint, typecheck, tests, and Vite build.
