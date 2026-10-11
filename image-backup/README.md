# LUXE PREMIUM — Convex image backup (read-only recovery)

Recovered from the still-live file storage of the old Convex deployment
`harmless-tapir-303.convex.cloud`. Function calls on that deployment are
disabled (usage limit), but `/api/storage/` file serving is still active.
This backup was taken before that could change.

## Contents
- `images/<storage-id>.png`  — the recovered images, named by their Convex storage ID
- `manifest.tsv`              — url, storage_id, local_file, http_status, content_type, bytes, valid_image, image_type, dimensions, note
- `url-to-file-map.tsv`       — url -> local file mapping for re-upload to the new Convex project
- `url-sources.tsv`           — whether each URL came from the live production bundle and/or the repo source

## Scope / limits
These are ONLY the image URLs that are hardcoded in:
  - the live production JS bundle (www.luxepremium.in/assets/index-7u3rXasD.js)
  - the repo source (seedData.ts, CategorySection.tsx, HeroSection.tsx, ShopByBrand.tsx, Auth.tsx)

They do NOT include images for products created at runtime through the admin
panel, because those storage IDs live in the Convex database, which is not
readable while the deployment is disabled. Recovering those requires a
production deploy key for `harmless-tapir-303`.

## Re-upload later
After uploading each file to the new deployment's storage, update the
`images[]` field on the matching product/document to the new URL, using
`url-to-file-map.tsv` as the 1:1 mapping. The old URL and the new URL differ
only in the hostname + storage ID, so the mapping is unambiguous.
