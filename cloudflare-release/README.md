# Huzaifa Portfolio — Published release

Website: https://huzaifa-portfolio.huzaifaalahmad23.workers.dev/
Owner editor: https://huzaifa-portfolio.huzaifaalahmad23.workers.dev/cms

Published on Cloudflare Workers Free with D1. Real GitHub owner sign-in and an authenticated save/reload were verified. Anonymous writes return 401. The current content revision is 4, with revision history retained.

The release includes frontend sources, the CMS worker, schema/seed, pinned dependency lockfiles and a reviewed public asset bundle. The delivery copy of wrangler.jsonc points to ../published-assets. No CLI credentials, OAuth secrets, local databases, .env files or node_modules are included. Cloudflare secrets remain in the hosting account.

To rebuild the frontend, install its locked dependencies and run its build script. Prepare and review the public assets before deployment; the source project also preserves unused legacy code and must not be treated as a list of assets to upload. The packaged published-assets folder contains the verified public release only.

Local CMS development uses Node 24 and SQLite. Production uses the Cloudflare worker and D1. Do not enable local development authentication in production. The CV PDF is maintained separately from editable website text. New arbitrary file uploads and automatic CV regeneration are not included.

The original Railway/MySQL database was not recovered or deleted. Source projects and previous review packages remain archived. Social Vision and APEX development follow completion of the professional-presence stage.
