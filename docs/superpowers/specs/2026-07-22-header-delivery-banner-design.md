# Header Delivery Banner Design

## Goal

Keep the slim announcement strip above the sticky CODAvenue header, render it in true black, and localize its delivery message with the existing English/French language toggle.

## Copy

- English: `Complimentary delivery from 500 MAD - Delivery across Morocco`
- French: `Livraison offerte dès 500 MAD - Livraison partout au Maroc`

## Presentation

The strip retains its current spacing, centered uppercase typography, and white text. Only the background token changes from midnight navy to black. The message changes immediately when the existing locale control changes language.

## Testing

A focused Node test verifies the exact copy for both supported locales. The existing frontend typecheck, lint, and build remain the integration checks.
