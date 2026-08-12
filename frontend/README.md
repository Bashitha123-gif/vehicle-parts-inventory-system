# Vehicle Parts Inventory — Frontend

A standard **Vite + React + TypeScript** SPA for a vehicle parts shop: inventory, purchasing, POS sales,
customers, suppliers and reporting.

## Stack

- React 18 + TypeScript
- Vite 8
- React Router DOM (SPA routing only)
- Tailwind CSS v4
- Lucide React icons
- Axios (`src/services/api.ts`) with JWT interceptor
- TanStack Query provider ready in `src/App.tsx`
- Recharts for dashboard/report charts

No SSR, no meta-framework, no proprietary tooling.

## Getting started

```bash
npm install
npm run dev
```

App runs at http://localhost:5173

## Environment

`.env`

```env
VITE_API_URL=http://localhost:3000
```

## Backend contract (NestJS + Prisma + PostgreSQL)

```
POST   /auth/login
POST   /auth/register
GET    /auth/profile

GET    /categories
GET    /categories/:id
POST   /categories
PATCH  /categories/:id
DELETE /categories/:id
```

Add new services by copying `src/services/category.service.ts`
(`product.service.ts`, `brand.service.ts`, `supplier.service.ts`,
`customer.service.ts`, `purchase.service.ts`, `sale.service.ts`).

## Notes

- Pages currently render placeholder data from `src/lib/mock-data.ts`. Swap each page's local
  state for a TanStack Query hook calling the matching service once the API is live.
- `AuthContext` falls back to a local demo session in dev when the API is unreachable;
  remove `demoUser` and the DEV fallback in `src/context/AuthContext.tsx` for production.
