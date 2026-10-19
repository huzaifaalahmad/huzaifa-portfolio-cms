# Keeping the website, search HTML and CVs consistent

The owner editor saves live public content immediately. Search-visible HTML and the two PDF CVs are deployment assets. A save in the editor does **not** regenerate or publish those assets.

These dependency-free Node 24 tools make that difference explicit. They never sign in, edit D1, deploy, publish a CV, or change a job platform.

## Check the current release

From `cloudflare-release` (the parent of this folder):

```sh
node release-tools/content-release.mjs verify
node release-tools/content-release.mjs check-live
```

`verify` checks the complete frontend profile against the CMS seed and the content hash reviewed with the two PDF files. The frontend build calls it first and stops if the text or PDF files differ from that reviewed release. `check-live` additionally reads the fixed public content endpoint and exits unsuccessfully if the live CMS differs. It reports field paths, counts and revision numbers, without reading credentials.

## Prepare after an owner edit

```sh
node release-tools/content-release.mjs prepare
```

This creates an isolated `.release/candidate-r…/` folder with the validated public snapshot, changed field paths and a complete English master-CV source. It retains every job, project and learning record; it does not overwrite the active source. `.release` is excluded from Git.

Review the candidate, including intentional additions/removals. Synchronize the reviewed candidate into `huzaifa-portfolio-frontend/src/data/personalProfile.json` and `portfolio-cms/seed.json`. Regenerate the tailored application CV and full master CV, render every page, verify the links and complete work history, then place both approved PDFs in the frontend public asset folder. Update `reviewed-release.json` with the exact CMS revision, canonical content hash from `prepare`, and SHA-256 of each reviewed PDF. This is a review record, not a command to approve a document automatically.

Run `verify`, the frontend build/typecheck and the CMS tests. Run `check-live` once more before uploading, so a newer owner edit is detected. Preserve the private Google verification file and certificate originals in the complete owner deployment, without adding them to public GitHub. Test the staged release, publish the approved free-hosting update and verify the public content revision, search HTML and PDF hashes. Update the employment-platform attachments only when the CV itself has changed.

This prevents publishing a new static release with an outdated CV. It cannot block separate edits made directly in the live CMS, and it does not make publication atomic with a later owner edit. Live checks must therefore be repeated at the publication boundary; an automatic deployment integration remains future work.
