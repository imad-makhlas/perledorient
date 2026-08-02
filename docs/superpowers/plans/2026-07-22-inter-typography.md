# Inter Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the Investir Alia serif typography and use the codinafrica.com-inspired Inter family across CODAvenue.

**Architecture:** Keep the existing `display` utility and Tailwind `font-display` interface, but map both display and body typography to Inter. This updates every existing heading and logo consumer without component-level duplication.

**Tech Stack:** React, Tailwind CSS, Inter, Node test runner

## Global Constraints

- Do not change the white, navy, champagne, or black color system.
- Do not change page structure or customer-facing copy.
- Leave changes uncommitted.

---

### Task 1: Inter-only typography system

**Files:**
- Create: `apps/web/src/styles/typography.node.test.ts`
- Modify: `apps/web/src/index.css`
- Modify: `apps/web/tailwind.config.js`

**Interfaces:**
- Consumes: existing `.display`, `font-display`, and `font-sans` typography hooks
- Produces: Inter-based display and body text across the application

- [ ] Write a failing design-contract test asserting Inter for display and sans typography.
- [ ] Run the focused test and confirm it fails because display typography still uses Cormorant Garamond.
- [ ] Remove Cormorant from the font import and map `.display` plus `font-display` to Inter.
- [ ] Run the focused test, full Node suite, lint, and production build.
