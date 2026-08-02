# CODAvenue Design Specification

The approved design is captured in [`docs/architecture.md`](../../architecture.md). It defines CODAvenue as a bilingual English/French, React/Vite and Spring Boot modular-monolith commerce platform using the Investir Alia visual language. Implementation follows the vertical-slice sequence in [`docs/implementation-plan.md`](../../implementation-plan.md), beginning with the complete customer catalogue-to-order journey and continuing through inventory, administration, accounts, and production readiness.

The specification contains no deferred architectural choices. Environment values are configurable, public checkout supports only cash on delivery and WhatsApp, and online payment remains a disabled enum value.
