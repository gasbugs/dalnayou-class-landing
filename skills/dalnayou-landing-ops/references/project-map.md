# Project Map

## Public surfaces

| File | Responsibility | Update when |
| --- | --- | --- |
| `index.html` | Primary two-course chooser | Course positioning, shared price badges, navigation, tracking |
| `main.html` | Alternate chooser mirror | Mirror `index.html` behavior; preserve `main.html` OG URL |
| `roblox.html` | Roblox AI detail page | Roblox audience, curriculum, schedule, CTA, location |
| `notebooklm.html` | NotebookLM detail page | NotebookLM audience, curriculum, schedule, CTA, location |
| `index-legacy.html` | Long-form legacy landing | User explicitly references sections that only exist here |
| `poster.html` | A4 print handout | Print copy, QR, print button, A4 spacing |
| `refund.html` | Public refund policy | Refund rules or policy links |
| `cardnews/index.html` | Card-news hub and copy tools | Ad copy, payment/confirmation/refund messages, resource links |
| `cardnews/source.html` | Render source for social cards | Text or design printed into PNG assets |
| `tracking-links.md` | Campaign URL registry and GA/GTM notes | New channels, UTM naming, event inventory |
| `campaign-pricing.js` | Shared phased price and form-attribution runtime | Price, deadline, form field, or phase changes |
| `scripts/build-site.sh` | Public deployment allowlist | Public pages or required runtime assets change |

## Derived assets

- `cardnews/png/instagram-*.png`: 8 files, 1080×1350.
- `cardnews/png/daangn-*.png`: 8 files, 1080×1080.
- `cardnews/instagram-cardnews-png.zip`.
- `cardnews/daangn-cardnews-png.zip`.
- Regenerate with `scripts/render-cardnews.sh` after editing `cardnews/source.html`.

## Shared invariants

- `index.html` and `main.html` should differ only where metadata intentionally points to their own URL.
- Course detail pages retain `apply_click` on every application CTA.
- Current pages use GTM container `GTM-KVC6H3SL`.
- UTM/source context survives main-to-detail navigation for the session.
- The A4 poster intentionally omits price and sends QR traffic with a print-specific UTM.
- `cardnews/index.html` keeps two payment-request and two confirmation templates, one per course.
- Important resource URLs appear inside copied text, not only as clickable UI.
- Course prices advance automatically: 189,000원 through 8/1, 199,000원 from 8/2 through 8/8, and 209,000원 from 8/9 through 8/15.
- Preview, legacy, source, and skill files remain in the repository but are excluded from the `dist/` deployment artifact.

## Existing commands

```bash
./scripts/render-cardnews.sh
bash scripts/build-site.sh
skills/dalnayou-landing-ops/scripts/audit-site.sh .
git diff --check
```

GitHub Pages builds and deploys `dist/` on pushes to `main` through `.github/workflows/pages.yml`.
