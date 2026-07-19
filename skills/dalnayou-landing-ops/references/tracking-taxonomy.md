# Tracking Taxonomy

## Canonical URL shape

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=<source>&utm_medium=<medium>&utm_campaign=dalnayou_2026_08&utm_content=<placement>
```

Use lowercase ASCII with underscores. Keep one stable meaning per field.

## Field responsibilities

- `utm_source`: platform or physical source, such as `facebook`, `naver`, `apartment_chat`, or `a4_poster`.
- `utm_medium`: distribution mechanism, such as `paid_social`, `paid_search`, `community`, `offline`, `social`, or `qr`.
- `utm_campaign`: campaign wave, currently `dalnayou_2026_08`.
- `utm_content`: placement or creative, such as `feed_ad`, `group_message`, `print_qr`, or `roblox_creative_a`.
- `utm_term`: paid-search keyword when useful.

## Current examples

```text
Facebook ad:
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=feed_ad

Apartment chat:
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=apartment_chat&utm_medium=community&utm_campaign=dalnayou_2026_08&utm_content=group_message

A4 poster QR:
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=a4_poster&utm_medium=offline&utm_campaign=dalnayou_2026_08&utm_content=print_qr

Naver Powerlink:
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=naver&utm_medium=paid_search&utm_campaign=dalnayou_2026_08&utm_content=powerlink
```

## Event meanings

- `landing_source_detected`: landing URL contained supported source parameters.
- `apply_click`: user clicked from the site to the Google application form; this is not proof of submission.
- `contact_click`: user opened an inquiry channel.
- `map_click`: user opened a map destination.
- `print_click`: user invoked print/PDF from the A4 page.
- `download_click`: user downloaded a card or archive.
- `copy_click`: user copied marketing or operator text.

## GA4 reporting

1. Confirm `apply_click` in Realtime.
2. Mark `apply_click` as a key event.
3. Use Traffic acquisition with Session source/medium and select `apply_click` in Key events.
4. Use Exploration with Event name and `link_position` to compare hero, final, and mobile CTAs after registering it as an event-scoped custom dimension.

Track form completion separately if required. A cross-domain Google Form needs a supported completion signal or a controlled confirmation page.
