# Header Delivery Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep a true-black bilingual complimentary-delivery strip above the CODAvenue header.

**Architecture:** Store the two pieces of announcement copy in a small typed module and select the active copy from the existing locale state in `Header`. Keep presentation inside the header component.

**Tech Stack:** React, TypeScript, Tailwind CSS, Node test runner

## Global Constraints

- Keep the current announcement-strip dimensions and typography.
- English and French are the only supported locales.
- Leave all changes uncommitted.

---

### Task 1: Localized delivery announcement

**Files:**
- Create: `apps/web/src/components/layout/header-announcement.ts`
- Create: `apps/web/src/components/layout/header-announcement.node.test.ts`
- Modify: `apps/web/src/components/layout/Header.tsx`

**Interfaces:**
- Consumes: existing `locale` value from `useI18n()`
- Produces: `getHeaderAnnouncement(locale: 'en' | 'fr'): string`

- [ ] **Step 1: Write the failing test**

Assert the exact English and French delivery messages returned by `getHeaderAnnouncement`.

- [ ] **Step 2: Run the focused test and verify RED**

Run the Node test directly and expect failure because `header-announcement.ts` does not exist.

- [ ] **Step 3: Implement the minimal copy selector**

Create the typed copy map and use it from `Header.tsx`; change the strip class from `bg-midnight` to `bg-black`.

- [ ] **Step 4: Verify GREEN and integration**

Run the focused test, complete frontend Node suite, TypeScript compiler, ESLint, and Vite production build. Expect exit code 0 from every command.
