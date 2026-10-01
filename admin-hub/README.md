# TCFR private marketing admin hub

This is a separate Cloudflare Pages application for `https://admin.thecloudforestretreat.com/`. It does not share public routes, analytics tags, or the public sitemap. It displays aggregate marketing and site-health data only.

## Verified platform configuration

| System | Identifier | Status verified 2026-10-01 |
| --- | --- | --- |
| GA4 | property `449392042`, stream `8455404842`, measurement `G-D3W4SP5MGX` | Data collection active; recent events visible |
| Search Console | `sc-domain:thecloudforestretreat.com` | Linked to GA4; production sitemap successful |
| Tag Manager | account `6378581981`, container `265010300` / `GTM-KJ67MZ2C`, workspace `3` | Version 2 published; one Google tag; no workspace changes |
| Google Business Profile | The Cloud Forest Retreat, one location | Owner access confirmed; Performance API authorization pending |
| Cloudflare | `thecloudforestretreat.com` | Public site and forms live; admin project pending creation |

GA4 currently labels consent signals inactive. A direct production browser probe confirmed denied defaults, cookieless denied-state pings, accepted updates, and post-consent cookies. Keep this diagnostic open until GA4 has enough production traffic to refresh its status.

## Build and test

```sh
npm test
npm run build
```

Cloudflare Pages configuration:

- Root directory: `admin-hub`
- Build command: `npm run build`
- Build output: `dist`
- Production branch: `codex/tcfr-site-upgrade`
- Custom domain: `admin.thecloudforestretreat.com`

## Required encrypted secrets

Never commit the values.

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `CF_ACCESS_TEAM_DOMAIN`
- `CF_ACCESS_AUD`

The service account needs Viewer access to GA4 property `449392042`, read access to the Search Console domain property, and read access to GTM account `6378581981`. Enable the Google Analytics Data API, Search Console API, and Tag Manager API in its Google Cloud project.

Optional future Cloudflare API reporting secrets can be added after the base launch; public availability checks work without them. Google Business Profile Performance reporting remains pending until the Google project is approved and an owner completes OAuth authorization.

## Cloudflare Access

Create a self-hosted Access application for `admin.thecloudforestretreat.com/*`. Add an Allow policy containing only:

- `thecloudforestretreat@gmail.com`
- `sschettini18@gmail.com`

Use email one-time PIN authentication. Copy the Access application audience tag into `CF_ACCESS_AUD` and the team hostname such as `your-team.cloudflareaccess.com` into `CF_ACCESS_TEAM_DOMAIN`. The middleware verifies the signature, issuer, expiration, audience, and email allowlist. It rejects direct `pages.dev` access and allows localhost for QA.

## Privacy and caching

Every response receives `private, no-store`, crawler-blocking, CSP, frame, referrer, permissions, and MIME-sniffing headers. The browser never receives Google credentials or raw form submissions. The reports contain aggregate counts and public page/search terms only.

## Post-launch checks

1. Confirm both approved emails can authenticate and an unapproved email cannot.
2. Confirm the `pages.dev` hostname returns 403.
3. Open all six routes at 320, 768, and 1440 pixels.
4. Confirm GA4, Search Console, and GTM cards show live API data.
5. Confirm the production sitemap remains successful; retain old WordPress/RSS submissions until replacement coverage is stable.
6. Confirm a real, server-accepted form produces exactly one `form_submit_success` event with no personal data, then mark that event as a GA4 key event.
7. Recheck GA4 consent diagnostics after production traffic accumulates.
