# Search-ready portfolio

The production build runs `node build-seo.mjs`. It generates the full portfolio from the same React component used by the interactive browser app. Search crawlers and visitors without JavaScript receive real headings, work history, projects, education and links immediately. The browser still loads current CMS content and supports Arabic, themes and interactions.

The generated HTML contains a self-referencing canonical URL, social metadata and a WebSite / ProfilePage / Person JSON-LD graph based on verified public professional information. Administrative and preview pages use a separate shell with noindex metadata and an X-Robots-Tag header. The API also sends noindex. Unknown pages return a genuine 404 instead of a successful portfolio page. Consolidated legacy section routes redirect to corresponding homepage anchors.

The 1254×1254 portrait is delivered as WebP (186,392 bytes instead of 2,287,843 bytes). Public static assets remain on Cloudflare's free asset delivery; this change adds no rendering service or paid dependency.

Before publishing after a CMS content edit, synchronize `src/data/personalProfile.json` with the reviewed current public CMS content. Rebuild to refresh the search-visible HTML snapshot. CMS content is still live for interactive visitors without a rebuild; search HTML updates at deployment time. Re-run the CMS integration tests and `tests/seo.test.mjs` after building. Keep the built public assets and Worker configuration together.

The source repository intentionally excludes ownership-verification values and original certificate binaries. Restore professional assets from the owner's private delivery archive when rebuilding the complete release. Keep ownership verification in the live/private deployment copy, never in public GitHub files. No OAuth secrets, CLI credentials or local databases belong in a release.

The canonical website is https://huzaifa-alahmad.pages.dev/. The old Vercel site now deploys permanent redirects from its root frontend configuration; the previous Workers homepage also redirects to Pages. Keep the old hostnames and projects so existing links continue to work.

On 19 October 2026, Search Console ownership was verified for the Pages property and sitemap.xml was submitted. Google initially reported that it could not fetch the sitemap. The manual homepage indexing request was refused because the account's daily request quota was exceeded. Recheck sitemap processing and retry manual indexing after the quota resets; new search appearance and ranking are not guaranteed by technical checks. Change of Address has not been submitted because ownership of the old property has not been established in the personal account.
