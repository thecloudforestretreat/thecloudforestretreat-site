# thecloudforestretreat-site
Staging and production site for thecloudforestretreat.com

The private marketing dashboard is maintained in [`admin-hub/`](admin-hub/README.md) and deploys as a separate Cloudflare Pages project at `admin.thecloudforestretreat.com`. It is excluded from the public site, sitemap, and crawler routes.

## Performance maintenance (2026-10-09)

Public homepage imagery uses sized WebP copies; originals remain unchanged. Preserve matching English/Spanish pages when editing their image references. Niebli and the Retreat serve the existing brand fonts from assets/fonts with their OFL licenses. Regenerate optimized variants after replacing source photographs, preserving aspect ratio and mobile cropping. Test consent, navigation, responsive layouts and Lighthouse before deployment.
