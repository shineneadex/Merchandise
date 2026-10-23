# Expression Music International — Merchandise Store

A responsive React + Vite storefront using the supplied Expression Music sweatshirt images and logo.

## Features
- Six sweatshirt design/colour combinations, each priced at £25
- Colour and size selection (S, M, L, XL, 2XL, 3XL)
- Quantity controls, add-to-bag, cart editing and item removal
- Shop, Our Story, Ordering Information, Cart and Checkout views
- Checkout form and bank transfer details with copy buttons
- Responsive layout for mobile, tablet and desktop
- No backend required to preview the storefront

## Run locally
Requirements: Node.js 18+ (Node.js 20+ recommended).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build for Vercel
1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New → Project**, import the repository.
3. Framework preset: **Vite** (usually detected automatically).
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**.

No environment variables are required for this front-end demo.

## Important checkout limitations
This is a front-end starter storefront. The checkout creates an order summary in the browser only; it does not send customer details to a server, email orders, store orders persistently, verify bank transfers, calculate delivery or process payments. Before accepting real orders, connect a secure backend/order service, add appropriate privacy notices and operational contact details, and confirm the bank account details and fulfilment process. Never collect or store payment-card details in this app.

## Bank transfer details currently displayed
- Business name: THE EXPRESSION MUSIC INTERNATIONAL
- Sort code: 08-71-99
- Account number: 15206046

Please verify the payment details before publishing the site.
