# 달나유 랜딩 유입 추적 링크

기본 랜딩:

```text
https://gasbugs.github.io/dalnayou-class-landing/
```

## 채널별 링크

Facebook 로블록스 광고:

```text
https://gasbugs.github.io/dalnayou-class-landing/roblox.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=roblox_creative_a
```

Facebook NotebookLM 광고:

```text
https://gasbugs.github.io/dalnayou-class-landing/notebooklm.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=notebooklm_creative_a
```

유튜브 쇼츠 본문:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=youtube&utm_medium=social&utm_campaign=dalnayou_2026_08&utm_content=shorts_description
```

유튜브 고정 댓글:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=youtube&utm_medium=social&utm_campaign=dalnayou_2026_08&utm_content=pinned_comment
```

인스타그램 프로필/스토리:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=instagram&utm_medium=social&utm_campaign=dalnayou_2026_08&utm_content=profile_link
```

당근 게시글:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=danggeun&utm_medium=community&utm_campaign=dalnayou_2026_08&utm_content=local_post
```

카카오톡 공유:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=kakaotalk&utm_medium=community&utm_campaign=dalnayou_2026_08&utm_content=shared_message
```

카드뉴스 QR:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=cardnews&utm_medium=qr&utm_campaign=dalnayou_2026_08
```

포스터 QR:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=a4_poster&utm_medium=offline&utm_campaign=dalnayou_2026_08&utm_content=print_qr
```

## GA4 이벤트 수집 구조

랜딩은 Google 태그 `G-6W058PFM90`의 `gtag.js`로 GA4 이벤트를 직접 전송합니다. Google Tag Manager 컨테이너 `GTM-KVC6H3SL`도 페이지에 포함되어 있지만, 2026년 7월 23일 공개 컨테이너 점검 결과 태그가 없는 상태이므로 현재 측정 정본은 `gtag.js`입니다. GTM에 GA4 태그를 추가할 때에는 직접 수집 코드를 함께 유지하지 말고 한쪽만 측정 정본으로 선택합니다.

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
- `application_submit`: 기존 Google 신청서가 실제 제출된 경우

현재 메인 랜딩(`index.html`, `main.html`)은 URL의 `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `source`, `src`, `ref`, `channel`, `campaign` 값을 읽어 `landing_source_detected`와 이후 클릭 이벤트에 함께 보냅니다. `roblox.html`, `notebooklm.html` 상세 페이지에서도 전달된 파라미터를 `apply_click`, `contact_click`, `share_click`, `map_click` 이벤트에 함께 보냅니다.

이벤트 파라미터를 GA4 표와 탐색 보고서에서 측정기준으로 사용하려면 GA4 관리자 화면에서 맞춤 정의를 등록해야 합니다.

## 향후 GTM으로 전환할 때의 태그·트리거

다음 설정은 현재 필수 작업이 아니라, 직접 `gtag.js` 수집을 GTM으로 이전할 때 사용하는 전환 절차입니다.

1. GA4 기본 태그를 GTM에 추가
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

3. GA4 이벤트 태그 추가
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

5. GA4 맞춤 정의 등록
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

2026년 7월 23일 기준 GA4에는 `apply_click`과 `application_submit`이 주요 이벤트로 지정되어 있습니다. 같은 날 이벤트 범위의 맞춤 측정기준 `link_position`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `landing_path`, `course_selection`, `source_system`도 등록했습니다. 맞춤 측정기준은 등록 이후 수집되는 이벤트부터 보고서에서 사용할 수 있습니다.

`application_submit`은 기존 Google 신청서와 연결된 응답 스프레드시트의 Apps Script 설치형 트리거로 전송합니다. 트리거는 `trackApplicationSubmit` 함수를 `스프레드시트에서 → 양식 제출 시` 조건으로 실행하며, 신청서 문항이나 응답 흐름은 변경하지 않습니다. 이름·전화번호 등 개인정보는 GA4로 보내지 않고 `source_system`, `campaign_name`, `course_selection`만 전송합니다. 2026년 7월 23일 테스트 실행이 Apps Script에서 정상 완료됐고, GA4 실시간 보고서에서 `application_submit` 1건 수집을 확인했습니다.

## 내부 운영자 트래픽

Direct 유입에는 운영자와 직원의 점검 방문이 포함될 수 있으므로 실제 고객 전환과 분리합니다. 고정 IP를 사용하는 환경에서는 GA4 데이터 스트림의 내부 트래픽 규칙과 데이터 필터를 사용합니다. 유동 IP 환경에서는 운영자 전용 테스트 링크와 DebugView를 사용하고, Direct의 주요 이벤트를 광고 성과로 해석하지 않습니다.
