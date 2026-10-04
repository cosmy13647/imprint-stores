# Cosmy Flagships conversion

This is the Cosmy Flagships phone shop. It runs on a React/Vite frontend and a Node/Express/PostgreSQL backend, converted from the original clothing storefront.

## Preserved
- React/Vite setup
- React Router
- Authentication
- Cart context/localStorage
- Existing order API
- Existing admin route and backend
- Existing Vercel-friendly client build

## Changed
- Rebranded to Cosmy Flagships
- Phone-focused homepage/shop/product detail/checkout copy
- KSh display on customer-facing product UI
- WhatsApp CTA: 0112 802 314
- Eldoret location
- New Cosmy logo
- Phone-focused responsive styling

## Important
The existing database still controls the actual products shown by `/api/products`.
Before going live, replace the clothing records in the database with real phone records and upload their phone images.

The current frontend intentionally does not invent phone inventory, prices, battery health or condition.

## Vercel
Deploy the `client` directory as the Vercel project root if the current project is configured that way.

After deployment:
1. Add the chosen custom domain in Vercel Project Settings > Domains.
2. Add the DNS record(s) Vercel gives you at the domain registrar.
3. Verify the domain.
