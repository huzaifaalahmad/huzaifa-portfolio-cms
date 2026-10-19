# Huzaifa Alahmad — professional portfolio

Primary website: https://huzaifa-alahmad.pages.dev/
Owner administration: https://huzaifa-alahmad.pages.dev/cms

The bilingual portfolio combines creative work, complete professional experience, technical project skills and seven digital/university team projects. Public content is present in generated HTML for search engines. The CVs include the current short address.

## Hosting

Cloudflare Pages Free serves the public site. Its minimal Worker proxies only GET/HEAD `/api/cms/content` through the `CONTENT_SERVICE` service binding to the existing `huzaifa-portfolio` Worker. Browser credentials are never forwarded. Administration redirects to the established Workers origin, retaining its GitHub owner authentication, CSRF checks, D1 revisions and restore history. No authentication secrets belong in this repository.

The previous Worker homepage redirects permanently to Pages. Legacy Vercel retirement configuration lives at the original root frontend path and deploys only permanent redirects. Keep both old hostnames to preserve existing links; do not delete their projects merely to retire old content.

## Source and builds

The active source is in `huzaifa-portfolio-frontend/` and `portfolio-cms/`. `published-assets/` is the reviewed production asset snapshot; certificate originals and ownership verification values are excluded. Before building, copy `published-assets/assets/personal/` to `huzaifa-portfolio-frontend/public/assets/personal/` and `published-assets/projects/` to `huzaifa-portfolio-frontend/public/projects/`. Restore certificate assets from the private owner archive when preparing an owner deployment.

With Node.js 24: install the locked frontend dependencies with `npm ci`, then `npm run build` and `npx tsc --noEmit`. The build pre-renders the public React page after Vite. Install the CMS dependencies with `npm ci`; run `node --test tests/*.test.mjs` for integration, SEO, proxy and actual Workers runtime coverage.

For Pages, assemble `pages-assets/` from the frontend build without `cms-shell.html`, copy `portfolio-cms/pages-public-worker.mjs` as `_worker.js` and copy `_routes.json` and `_redirects` from `pages-config/`. Add the owner's Google verification file privately. Use the production `CONTENT_SERVICE` binding to `huzaifa-portfolio`. Upload the complete folder/ZIP through Cloudflare Pages. The owner CMS uses `portfolio-cms/wrangler.jsonc`; update its asset snapshot after an approved build and set secrets through Cloudflare, never source files.

## Validation — 19 October 2026

Twelve automated tests pass, including a real Workers runtime proxy test. All 58 public HTTP assets match the release manifest. Pages canonical, complete HTML, real 404, CMS redirects and content revision 4 were verified. Eight migration route checks pass; anonymous content mutations remain unauthorized. Search Console ownership is verified and the sitemap was submitted. Google initially reported it could not fetch the sitemap; the manual indexing request was refused because the account's daily quota was exceeded. Indexing and search position are not claimed.

University repositories remain attributed to the team and original repository owner. Social Vision and APEX are explicitly in development. Software skills are framed as project-based, AI-assisted experience, with no invented employment roles, ratings or durations.
