# Selected project case studies

Prepared in English on 19 October 2026 from owner-confirmed information, reviewed source and completed technical checks. These are reusable project narratives. They do not introduce sales, engagement or hiring results.

## Personal Portfolio CMS

**Role:** Project owner, visual direction and AI-assisted implementation and testing.

**Problem.** My previous portfolio depended on an Express/MySQL service. Its database stopped when the hosting trial expired, leaving administration unreliable. The public site also needed a consistent professional story across creative work and software projects.

**Approach.** I rebuilt the active portfolio with React and TypeScript, supporting English and Arabic, light and dark themes, motion and a responsive layout. Creative work opens on Behance, while software projects have their own identity and links. A separate Cloudflare Worker and D1 content service provides owner editing with GitHub sign-in, revision checks and restorable content history. Cloudflare Pages serves the public portfolio on a short free address.

**Engineering decisions.** The build pre-renders the same public React component into HTML so work history, projects and professional information are present before JavaScript loads. The public Pages bridge permits only reads of the public content endpoint through a service binding; it does not forward browser cookies or authorization. Administration stays on its established authenticated origin. Old portfolio URLs redirect permanently to the new site, preserving existing links. A release check now compares the frontend profile, CMS seed and reviewed PDF hashes; a live comparison catches subsequent CMS edits before publication.

**Verified delivery.** Five professional roles, seven projects and 24 learning/recognition records are represented in the current content. The preceding published release passed 12 automated checks, including an actual Workers runtime proxy test, plus asset-hash and migration-route verification. On 19 October, Google's live URL test fetched both the homepage and sitemap successfully; the homepage exposed one valid ProfilePage structured-data item.

**Limits.** Google indexing and rankings remain unconfirmed. A CMS save does not automatically regenerate PDF CVs or redeploy the static search snapshot. The release tooling detects this difference and prepares a review candidate; publication and PDF layout review remain explicit steps. Historical MySQL data has not been recovered.

**Links:** [Live portfolio](https://huzaifa-alahmad.pages.dev/) · [Source](https://github.com/huzaifaalahmad/huzaifa-portfolio-cms/tree/main/cloudflare-release)

## XO 3D Arena

**Role:** Project owner and visual direction; development and testing with AI assistance, evolving my original browser-game source.

**Goal.** Turn my original simple browser game into a complete, accessible local game that can be opened directly from a portfolio.

**Implementation.** The game uses HTML, CSS and JavaScript without a framework or build step. Players can switch between Arabic and English, two players on the same device or a computer opponent, and three difficulty levels. A dimensional board and a blue/amber identity give it a distinct visual presentation. Scores persist on the current device, and restart/reset controls handle the game state.

**Interaction and testing.** Hard mode uses minimax. The test suite exhaustively explored 681 human continuations without a computer loss. Further checks cover legal moves, restarting during a delayed computer move and persistent scores. Keyboard focus, live turn announcements, the result dialog and reduced-motion behavior are part of the interface. Prior browser checks covered a human win, a new round, language/theme controls and a mobile layout.

**Limits and attribution.** This is a local browser game. It does not implement remote multiplayer, accounts or an online leaderboard. The logo was created with AI assistance. Cairo and Manrope font license notices are retained. No open-source license has been selected for the game code or identity.

**Links:** [Play](https://huzaifa-alahmad.pages.dev/projects/xo/index.html) · [Source and run instructions](https://github.com/huzaifaalahmad/xo-3d-arena)

## Creative production practice — content planning through delivery

**Role:** Creative Marketing Specialist at Green Signal; original design, filming, AI scene direction, editing and social publishing. This describes my confirmed work scope, rather than measured campaign performance.

**Brief.** Maintain a coherent visual presence while producing multiple content formats across Meta, TikTok and Snapchat. My monthly planning targets approximately 15 short videos and 15 carousels, alongside promotional content.

**Workflow.** Research and planning lead into visual concepts, product photography or filming, AI-generated scenes where appropriate, editing, review and platform-specific delivery. My primary editing tool is CapCut, followed by DaVinci Resolve and Premiere Pro. Photoshop, Illustrator and InDesign support identity, campaign graphics, catalogues and print work. ChatGPT, Gemini, Google Flow, NotebookLM and Seedance support research and production tasks within the workflow.

**Responsibility.** I manage a team with formal responsibility for performance evaluation, contribute to audience and budget discussions, and coordinate branding quotations and model sourcing. These are responsibilities confirmed by the owner; they are not a claim of a different formal employment title.

**Evidence and presentation.** The supplied material includes real filming/editing projects, AI-assisted video projects and a four-image fragrance carousel contrasting fresh and warm spaces. A project presentation should identify which shots were filmed, generated and edited, and show a short selection on Behance. Creative files are not embedded into the personal website, in line with the owner's preference.

**Still needed for a quantified campaign case study.** A defined campaign period, the campaign objective, an approved metrics export and attribution context. Planned content volume must not be described as a reach, revenue or conversion result. The proposed rebrand that was not adopted must be labelled as a concept if presented later.

**Link:** [Creative portfolio](https://www.behance.net/huzaifaalahmad23)

## Project status and attribution register

| Project | Current presentation | Next evidence needed |
| --- | --- | --- |
| Personal Portfolio CMS | Published personal project; owner, direction and AI-assisted implementation | A later release record after future CMS edits |
| XO 3D Arena | Published local browser game with tested hard opponent | Optional gameplay screenshots; no new feature claims |
| Rare Oud | Personal storefront/backend project; code supplied and archived | A fresh clean setup and production-readiness review before calling it a live shop |
| Engineering Encyclopedia | University team project; link to RamiElawi's original repository | Exact individual contribution and approved team credits |
| Modern Electronic School | University team project; link to RamiElawi's original repository | Exact individual contribution and approved team credits |
| Social Vision | Branding/marketing/AI venture and site in development | Repair/rebuild phase deferred until professional presence work is finished |
| APEX Cognition Platform | Market-analysis and simulated-trading project in development | Separate technical review; no live-money, accuracy or profitability claims |
