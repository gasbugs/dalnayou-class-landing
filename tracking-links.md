# 달나유 랜딩 유입 추적 링크

기본 랜딩:

```text
https://gasbugs.github.io/dalnayou-class-landing/
```

## 채널별 링크

유튜브 쇼츠 본문:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=youtube&utm_medium=shorts&utm_campaign=dalnayou_2026_08
```

유튜브 고정 댓글:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=youtube&utm_medium=pinned_comment&utm_campaign=dalnayou_2026_08
```

인스타그램 프로필/스토리:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=instagram&utm_medium=social&utm_campaign=dalnayou_2026_08
```

당근 게시글:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=daangn&utm_medium=local&utm_campaign=dalnayou_2026_08
```

카카오톡 공유:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=kakao&utm_medium=chat&utm_campaign=dalnayou_2026_08
```

카드뉴스 QR:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=cardnews&utm_medium=qr&utm_campaign=dalnayou_2026_08
```

포스터 QR:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=poster&utm_medium=qr&utm_campaign=dalnayou_2026_08
```

## GA4 이벤트

랜딩은 GA4 측정 ID가 들어가면 아래 이벤트를 보냅니다.

- `apply_click`: 신청서 클릭
- `contact_click`: 카카오톡 문의 클릭
- `section_click`: 내부 섹션 이동 클릭
- `policy_click`: 환불 정책 클릭
- `shorts_section_view`: 쇼츠 섹션 노출

`index.html` 상단의 `window.DALNAYOU_GA4_ID = "";`에 `G-...` 측정 ID를 넣으면 수집이 시작됩니다.
