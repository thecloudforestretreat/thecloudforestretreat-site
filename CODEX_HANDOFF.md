# TCFR Site Upgrade — Codex Handoff

Last updated: 2026-09-30

## Purpose

This document transfers the active The Cloud Forest Retreat website upgrade to a different Codex account and host. The receiving Codex task must treat the repository, this document, and the enriched roadmap CSV as the working record. The shared conversation link is supplied separately and must not be committed to this public repository.

## Repository and branch

- Repository: `https://github.com/thecloudforestretreat/thecloudforestretreat-site.git`
- Working branch: `codex/tcfr-site-upgrade`
- Production must remain unchanged until the complete bilingual staging site is approved.
- Never overwrite unrelated user changes.
- Before editing, run `git status --short --branch`, fetch `origin`, and confirm the working tree is clean.

## Current implementation status

The enriched roadmap contains 49 English/Spanish page pairs (98 rows).

- Completed and pair-level QA verified: 6 pairs
- Remaining for full page enrichment and pair-level QA: 43 pairs
- Next pair in roadmap order: `pair_006`
  - English: `/rooms/panoramic-suite/`
  - Spanish: `/es/habitaciones/suite-panoramica/`
  - Cluster: Rooms

Completed pairs:

1. `pair_001`: `/` and `/es/`
2. `pair_002`: `/about/` and `/es/sobre-nosotros/`
3. `pair_003`: `/booking/` and `/es/reservas/`
4. `pair_004`: `/contact/` and `/es/contacto/`
5. `pair_005`: `/rooms/` and `/es/habitaciones/`
6. `pair_023`: `/cloud-forest-lodge-near-quito/` and `/es/lodge-bosque-nublado-cerca-de-quito/`

Authoritative roadmap:

`outputs/01a0cacb-9307-7181-a26c-990d3a098536/TCFR_site_roadmap_enriched_2026-09-23.csv`

Update both language rows only after a pair passes implementation and QA. Do not mark a pair complete because a global architecture script touched it.

## Approved design system

The cluster prototypes and global system are approved. Preserve the established branding kit, fonts, and colors.

Global requirements:

- One consistent 1280-pixel content shell, container alignment, and section rhythm.
- Use the global page-top spacing token: 18 pixels on desktop and 12 pixels on mobile.
- Sticky header on desktop and mobile.
- The current language must be visibly selected in the language switcher.
- Mobile navigation must remain easy to use and must not overflow.
- Shared footer must be consistent site-wide.
- Keep “The Cloud Forest Retreat” on one line where space permits.
- Social icons appear above the bottom copyright/location/terms line.
- Use equal-height cards in the same grid row on desktop when the content is comparable.
- Use responsive stacking on smaller viewports without artificial empty space.
- Keep HTML vertical, clearly indented, and maintainable.
- Do not introduce unsupported, exaggerated, misleading, or cheesy positioning statements.
- Page-cluster CSS controls visual differences; important conversion and practical information must remain in the page content.

Approved review presentation:

- Three individual review cards where the design calls for testimonials.
- Use the approved Google-style gold star treatment.
- Reviewer identity format:
  - Reviewer name
  - `Google review`
- Keep review cards visually aligned and prominent without overpowering the page.

## Shared architecture

Global assets:

- `assets/css/global.css`
- `assets/css/site.css`
- `assets/css/header.css`
- `assets/css/footer.css`
- `assets/css/components/faq.css`
- `assets/includes/header.html`
- `assets/includes/header-es.html`
- `assets/includes/footer.html`
- `assets/js/site-config.js`
- `assets/js/head.js`
- `assets/js/attribution.js`
- `assets/js/site.js`
- `assets/js/booking-form.js`
- `assets/js/contact-form.js`

Approved cluster styles:

- `assets/css/clusters/home.css`
- `assets/css/clusters/stay.css`
- `assets/css/clusters/rooms.css`
- `assets/css/clusters/features.css`
- `assets/css/clusters/nature-birding.css`
- `assets/css/clusters/planning.css`
- `assets/css/clusters/editorial.css`
- `assets/css/clusters/conversion.css`
- `assets/css/clusters/legal.css`

Centralized configuration currently controls:

- WhatsApp number, availability, localized messages, and widget assets
- GA4 measurement ID and GTM container ID
- Attribution storage period
- Google review rating, count, read URL, and write URL
- Booking/contact endpoints
- Cloudflare Turnstile enablement, public site key, and script URL
- Booking-provider links
- Social URLs

Do not scatter these values through individual pages. Add future site-wide values to `assets/js/site-config.js` and consume them through shared scripts/includes.

## Analytics, attribution, forms, and search-console status

Implemented in the repository:

- GTM loader with direct GA4 fallback
- First-touch and last-touch attribution storage
- UTM and click-ID capture for `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, and `ttclid`
- Attribution hydration into supported forms
- Shared click and conversion hooks used by upgraded pages
- Centralized Turnstile client configuration
- Sitemap and robots files

Still requires account-side or production-domain verification:

- Confirm the published GTM container version and all required tags/triggers/variables.
- Confirm GA4 DebugView and Realtime receive page views and defined conversion events without duplicates.
- Confirm form submissions carry permitted attribution fields and never send form PII to analytics.
- Confirm Google Search Console ownership, preferred property, submitted sitemap, indexing, and canonical/hreflang interpretation.
- Confirm Turnstile hostname configuration and server-side token validation on the real staging/production domain.
- Confirm booking and contact endpoints succeed end-to-end.

Turnstile error `110200` is expected on an unapproved localhost hostname. Do not disable Turnstile to hide that local-only error. Validate it on an authorized staging hostname.

## Per-pair content and technical requirements

Every English/Spanish pair must receive:

- Accurate, guest-facing content with no invented claims.
- Search intent alignment and a useful conversion path.
- One H1 and a logical heading hierarchy.
- Unique title and meta description.
- Self-referencing canonical URL.
- Reciprocal English/Spanish hreflang plus `x-default` where used by the established pattern.
- Visible FAQs that exactly match FAQ structured data.
- Page-appropriate JSON-LD for SEO, AEO, GEO, and entity clarity.
- Contextual internal links and enough incoming links to meet or exceed the roadmap target.
- Tracked primary, secondary, language, review, WhatsApp, and relevant internal-link actions.
- Shared header, footer, global CSS, cluster CSS, scripts, and site configuration.
- Useful arrival, inclusion, trust, review, and planning information when it supports the page intent.
- English/Spanish semantic parity without awkward literal translation.
- No horizontal overflow at 390, 768, or 1440 pixels.
- Symmetrical grids and aligned comparable cards at desktop widths.

## QA and completion rule

Do not mark a pair complete until all of the following pass:

1. Both language pages are implemented.
2. Canonical and reciprocal hreflang values are correct.
3. FAQ text and FAQPage schema match.
4. Structured data parses and reflects visible content.
5. Internal links resolve locally and support the roadmap.
6. Analytics and attribution hooks are present.
7. Header, footer, site configuration, global CSS, and the assigned cluster CSS are used.
8. Rendered QA passes at 390, 768, and 1440 pixels.
9. Comparable desktop cards align and no artificial whitespace remains.
10. The pair’s two roadmap rows are updated with specific completion evidence.
11. Changes are committed with a focused commit message.

Existing pair-specific scripts and QA scripts in `scripts/` are useful references. Extend or add scripts using the same discipline instead of editing dozens of files mechanically without verification.

## Local preview

Serve the repository root on port 4173, then inspect both members of the current pair:

`python3 -m http.server 4173`

Example:

- `http://127.0.0.1:4173/rooms/panoramic-suite/`
- `http://127.0.0.1:4173/es/habitaciones/suite-panoramica/`

Local preview is not a production or public staging deployment.

## External source-file checklist

The current repository contains the working enriched roadmap and implementation assets. The following source files remain outside Git on the originating Mac. They are optional for continuing implementation but should be transferred if the receiving task must reproduce the original audit or data enrichment.

Available on the originating Mac:

- `TCFR_SiteMap - sitemap_enriched.csv`
  - SHA-256: `95ca55113701c5e4aa79b164a3f3427cc7b64b0d064ffbee6bfa8d9a371b7619`
- `TCFR.zip` (Screaming Frog/source audit archive)
  - SHA-256: `8196db050a2631fcadd04f0885120ac9b699059137a3f6b0e2b8f992f42594b2`
- `thecloudforestretreat.com-Performance-on-Search-2026-09-23 (1).zip`
  - SHA-256: `3aef8b37ea584adcec116ea11f977d26e1fcdb051d539bcf0f4aba322173844e`
- `thecloudforestretreat.com-Performance-on-Search-2026-09-23.zip`
  - SHA-256: `62730048ce26f95a4c6917b6acb3472d3a143c2bb60c6d8a096dc7038438f595`
- `sitemap.xml`
  - SHA-256: `5b164ccaa70f3c5ad9d2d8a0d13c51bb22179d5db85bacf0713db95ece001d4d`
- Original pasted roadmap/header reference text
  - SHA-256: `a228fb7f9f5c5f5e048e85416dcea788f417968c5ecf711c7475ff557f935cba`

Previously attached but not currently found at their original local paths:

- `TCFR_SiteMap - sitemap_enriched (2).csv`
- YouTube Search performance ZIP dated 2026-09-23
- TikTok Search performance ZIP dated 2026-09-23
- Instagram Search performance ZIP dated 2026-09-23

The shared conversation contains the visual-review screenshots. They do not need to be copied to continue coding, but transfer the original PNGs separately if pixel-level historical comparison is required.

Do not commit account credentials, private tokens, analytics secrets, form secrets, or downloaded account exports to the public repository.

## Continuation prompt for the receiving Codex account

Copy the following into a new Codex task on the Mac mini after checking out the branch:

> Continue the TCFR Site Upgrade from the repository handoff. Work only in the `thecloudforestretreat-site` repository on branch `codex/tcfr-site-upgrade`. Read `CODEX_HANDOFF.md` and the enriched roadmap CSV completely before editing. Inspect the working tree and current commits, then continue in roadmap order with `pair_006`: `/rooms/panoramic-suite/` and `/es/habitaciones/suite-panoramica/`. Preserve the approved global system and Rooms cluster, maintain English/Spanish semantic parity, vertical indented HTML, factual guest-facing content, global container/spacing consistency, equal-height comparable cards, responsive behavior, FAQs/schema parity, SEO/AEO/GEO, internal links, analytics attribution hooks, shared includes, and centralized site configuration. Render and verify both pages at 390, 768, and 1440 pixels. Update only the two corresponding roadmap rows after all QA gates pass, commit the pair with focused evidence, and report the completed pair and the next pair. Keep all work on staging; do not deploy production.

## First receiving-host checklist

1. Clone or open the TCFR repository on the Mac mini.
2. Fetch `origin` and check out `codex/tcfr-site-upgrade`.
3. Confirm this file and the six completed-pair commits are present.
4. Confirm `git status --short --branch` is clean.
5. Open the shared conversation link supplied out-of-band for design-decision history.
6. Start a local preview and verify one completed English/Spanish pair before changing the next pair.
7. Begin `pair_006` only after the baseline renders correctly.
