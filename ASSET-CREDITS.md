# Asset credits

All imagery is stored locally in `public/images/` and is served from the same origin as the app. Nothing in this list is requested from an external CDN at runtime.

## Photography

### Hero and story photography

The hero and story photographs remain in use and were downloaded from Unsplash under the [Unsplash License](https://unsplash.com/license). Attribution is not required by that licence, but source links are provided for traceability.

| Scene | Source file | Unsplash image |
| --- | --- | --- |
| Hero — croissants | `sources/croissant-b.jpg` | [photo-1530610476181-d83430b64dcd](https://images.unsplash.com/photo-1530610476181-d83430b64dcd) |
| Story — cafe table | `sources/latte.jpg` | [photo-1495474472287-4d71bcdd2085](https://images.unsplash.com/photo-1495474472287-4d71bcdd2085) |

## Supplied menu photography

The menu product photography was supplied by the business and is stored in `sources/menu/`. It is copied byte-for-byte from the supplied files and processed into the self-hosted variants in `public/images/products/`. No licence is stated here for the supplied photography.

## Original artwork

| Asset | Notes |
| --- | --- |
| `public/favicon.svg`, `public/icons/icon-192.png`, `public/icons/icon-512.png` | Original mark created for this demo. |
| Typeface files in `public/fonts/` | Fraunces and Manrope, served locally as variable WOFF2 files. Both font families are licensed under the SIL Open Font License. |

## Processing and licence notes

- Product photography is served at the supplied 3:2 ratio; the hero is 4:5 and the story is 4:3. Variants are converted to AVIF, WebP and progressive JPEG at multiple widths by `scripts/optimize-images.mjs`. The supplied originals are never re-saved, converted, resized, cropped, recompressed or stripped of metadata.
- The hero and story photographs are illustrative scene photography. They do not depict the actual products sold by the business.
- The hero and story photographs should be replaced with original photography before a real commercial launch, both for accuracy and to avoid representing another photographer’s work as your own.
- Instagram, WhatsApp and TikTok names and marks are trademarks of their respective owners. They are used here only to identify the corresponding social profiles.
- The app’s original code and generated artwork may be reused for this project; the Pistachio name and any third-party trademarks are not granted by this demo.
