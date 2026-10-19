# Huzaifa Alahmad — Published Portfolio Frontend

Live website: https://huzaifa-alahmad.pages.dev/

Owner editor: https://huzaifa-portfolio.huzaifaalahmad23.workers.dev/cms

React, TypeScript and Vite. The current public entry is PersonalPortfolio; content comes from the sibling Cloudflare Worker/D1 CMS with a bundled fallback. Owner authentication uses GitHub. Old Express/MySQL admin and reference UI files remain as historical source and are not the active public application.

Use Node 24, install locked dependencies with `npm ci`, then run `npm run build` and `npx tsc --noEmit`. Copy only reviewed personal assets and the projects directory from sibling `published-assets` into the corresponding `public` paths before rebuilding. Restore certificate originals privately from the owner archive; original certificates and Google ownership verification values are excluded from the public source copy. The complete owner delivery contains them for the approved deployment.

The sibling portfolio-cms directory contains production Worker/D1 code and a local SQLite development server. Pages exposes the public content endpoint through a service binding; /cms redirects to the established owner CMS origin above. The previous Worker homepage and old Vercel portfolio permanently redirect to Pages. The current public app does not require the old localhost:5000 backend. Development authentication must never be enabled in production.

Secrets remain in Cloudflare. No .env, local database, OAuth secret, CLI login file or dependency directory belongs in a delivery package. Updating website text does not regenerate the separately maintained CV PDFs.
