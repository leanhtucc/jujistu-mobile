# shop

Browse merchandise, add to cart and check out.

```mermaid
flowchart LR
  A[ShopScreen] --> B[useShop]
  B --> C[ShopProductCard]
  C -->|press| D[ShopProductSheet: size + quantity]
  C -->|quick add| E[cart]
  D --> E
  E --> F[ShopCartSheet]
  F -->|checkout| G[status: idle, paying, done]
  C -->|ticket product| H[onOpenTicket -> tickets feature]
```

- `useShop` owns category, search, cart, product sheet, checkout status and toast.
- Ticket products do not open the sheet; they call `onOpenTicket(zone)` and the app
  shell navigates to the tickets feature (features never import each other).
- Totals come from `data/shop-selectors.ts`.
- **Mock seam (ADR-0019):** checkout is a timer, no payment is taken.
