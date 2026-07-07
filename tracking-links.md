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

## GTM 이벤트

랜딩은 Google Tag Manager 컨테이너 `GTM-KVC6H3SL`로 아래 `dataLayer` 이벤트를 보냅니다.

- `apply_click`: 신청서 클릭
- `contact_click`: 카카오톡 문의 클릭
- `section_click`: 내부 섹션 이동 클릭
- `map_click`: 카카오맵·네이버지도 위치 클릭
- `policy_click`: 환불 정책 클릭
- `shorts_section_view`: 쇼츠 섹션 노출
- `print_click`: A4 포스터 인쇄/PDF 저장 클릭
- `download_click`: 카드뉴스 ZIP·PNG 다운로드
- `copy_click`: 카드뉴스 광고 문구·확정 메시지·환불 메시지 복사
- `landing_source_detected`: URL 파라미터가 있는 랜딩 진입 감지

현재 메인 랜딩(`index.html`, `main.html`)은 URL의 `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `source`, `src`, `ref`, `channel`, `campaign` 값을 읽어 `landing_source_detected`와 이후 클릭 이벤트에 함께 보냅니다. `roblox.html`, `notebooklm.html` 상세 페이지에서도 전달된 파라미터를 `apply_click`, `contact_click`, `share_click`, `map_click` 이벤트에 함께 보냅니다.

실제 GA4 보고서 수집은 GTM 컨테이너에서 GA4 태그와 위 이벤트명 기준의 맞춤 이벤트 트리거를 연결해야 시작됩니다. 이벤트 파라미터를 GA4 표/탐색 보고서에서 컬럼으로 보려면 GA4 관리자 화면에서 커스텀 정의도 등록해야 합니다.

## GTM에서 추가로 연결할 태그·트리거

1. GA4 기본 태그
   - 태그 유형: Google Analytics / Google tag 또는 GA4 Configuration
   - Measurement ID: GA4 웹 스트림의 `G-XXXXXXXXXX`
   - 트리거: All Pages 또는 Initialization - All Pages

2. 맞춤 이벤트 트리거
   - `apply_click`
   - `contact_click`
   - `section_click`
   - `map_click`
   - `policy_click`
   - `shorts_section_view`
   - `print_click`
   - `download_click`
   - `copy_click`
   - `landing_source_detected`

3. GA4 이벤트 태그
   - 위 맞춤 이벤트 트리거마다 같은 이름의 GA4 이벤트 태그를 만듭니다.
   - `apply_click`, `contact_click`은 GA4에서 Key event로 지정하는 것을 권장합니다.

4. 권장 Data Layer Variable
   - `link_position`
   - `link_text`
   - `link_url`
   - `outbound`
   - `section_id`
   - `video_id`
   - `file_name`
   - `utm_source`
   - `utm_medium`
   - `utm_campaign`
   - `utm_content`
   - `utm_term`
   - `source`
   - `src`
   - `ref`
   - `channel`
   - `campaign`
   - `landing_path`
   - `landing_query`
   - `landing_referrer`
   - `source_param_count`

5. GA4 커스텀 정의 권장 등록
   - 관리자 → 데이터 표시 → 맞춤 정의 → 맞춤 측정기준 만들기
   - 범위: 이벤트
   - 이벤트 매개변수:
     - `utm_source`
     - `utm_medium`
     - `utm_campaign`
     - `utm_content`
     - `utm_term`
     - `source`
     - `src`
     - `ref`
     - `channel`
     - `campaign`
     - `landing_path`
     - `landing_query`
     - `landing_referrer`
