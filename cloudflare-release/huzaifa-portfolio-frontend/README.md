# Huzaifa Alahmad — Published Portfolio Frontend

Live website: https://huzaifa-portfolio.huzaifaalahmad23.workers.dev/

Owner editor: https://huzaifa-portfolio.huzaifaalahmad23.workers.dev/cms

React, TypeScript and Vite. The current public entry is PersonalPortfolio; content comes from the sibling Cloudflare Worker/D1 CMS with a bundled fallback. Owner authentication uses GitHub. Old Express/MySQL admin and reference UI files remain as historical source and are not the active public application.

Use Node 24, install locked dependencies with `npm ci`, then run `npm run build` and `npm run typecheck`. For the packaged release, copy the reviewed sibling `published-assets` files into `public` before rebuilding. Its public assets include fonts, portraits, logos, certificate files, CV PDFs and the XO browser game. Do not upload all legacy assets without review.

The sibling portfolio-cms directory contains production Worker/D1 code and a local SQLite development server. Production uses /api/cms and /cms; /admin redirects to /cms. The current public app does not require the old localhost:5000 backend. Development authentication must never be enabled in production.

Secrets remain in Cloudflare. No .env, local database, OAuth secret, CLI login file or dependency directory belongs in a delivery package. Updating website text does not regenerate the separately maintained CV PDFs.
