# 달나유 랜딩 유입 추적 링크

기본 랜딩:

```text
https://gasbugs.github.io/dalnayou-class-landing/
```

## 채널별 링크

Facebook 로블록스 이미지 광고:

```text
https://gasbugs.github.io/dalnayou-class-landing/roblox.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=roblox_youth
```

Facebook 두 과정 통합 쇼츠 광고:

```text
https://gasbugs.github.io/dalnayou-class-landing/?utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=combined_courses_shorts
```

로블록스 이미지는 로블록스 상세 페이지, Gemini Notebook과 로블록스를 함께
소개하는 쇼츠는 두 과정 선택 페이지로 연결합니다. Meta에서는 부천 소사역
통학권의 18~24세를 중심으로 운영합니다. 초등학생 수강 문의는 당근·아파트
채팅방 등 보호자가 주로 보는 지역 채널로 연결합니다.

Facebook Gemini 노트북 광고:

```text
https://gasbugs.github.io/dalnayou-class-landing/notebooklm.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=notebooklm_creative_a
```

기업교육 이력 직접 랜딩 실험:

```text
https://gasbugs.github.io/dalnayou-class-landing/roblox.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=roblox_enterprise
```

```text
https://gasbugs.github.io/dalnayou-class-landing/notebooklm.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=notebooklm_enterprise
```

위 두 링크는 광고 메시지와 상세 페이지를 과정별로 일치시키는 다음 실험용입니다.
현재 집행 링크와 섞어 해석하지 않고 `utm_content`별로 비교합니다.

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
- `enterprise_trust_view`: 대기업·금융권·공공기관 출강 신뢰 섹션 노출
- `print_click`: A4 포스터 인쇄/PDF 저장 클릭
- `download_click`: 카드뉴스 ZIP·PNG 다운로드
- `copy_click`: 카드뉴스 광고 문구·확정 메시지·환불 메시지 복사
- `landing_source_detected`: URL 파라미터가 있는 랜딩 진입 감지

과정 상세 페이지의 기업 출강 이력 직후 CTA는 아래 `link_position`으로
구분합니다.

- `roblox_enterprise_trust_form`
- `notebooklm_enterprise_trust_form`

전환 실험의 기준선과 결과는 `marketing-history.md`에 누적합니다.
- `application_submit`: 기존 Google 신청서가 실제 제출된 경우
- `campaign_phase_view`: 방문 시 적용된 1차·2차 얼리버드 또는 파이널 등록 단계

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
   - `enterprise_trust_view`
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

2026년 7월 23일 기준 GA4에는 `apply_click`과 `application_submit`이 주요 이벤트로 지정되어 있습니다. 같은 날 이벤트 범위의 맞춤 측정기준 `link_position`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `landing_path`, `course_selection`, `source_system`, `campaign_phase`도 등록했습니다. 맞춤 측정기준은 등록 이후 수집되는 이벤트부터 보고서에서 사용할 수 있습니다.

`application_submit`은 기존 Google 신청서와 연결된 응답 스프레드시트의 Apps Script 설치형 트리거로 전송합니다. 트리거는 `trackApplicationSubmit` 함수를 `스프레드시트에서 → 양식 제출 시` 조건으로 실행합니다. 강좌 페이지는 신청 링크의 `유입 정보 (자동 입력)` 항목에 UTM·랜딩 경로·모집 단계·현재 가격을 미리 채우고, Apps Script는 이를 허용 목록으로 제한해 GA4에 전달합니다. 이름·전화번호 등 개인정보는 GA4로 보내지 않습니다.

2026년 7월 23일 실제 Google Form 테스트 응답 1건을 제출해 접수 완료 화면, 폼 응답 증가, GA4 실시간 보고서의 `application_submit` 1건을 모두 확인했습니다. GA4 탐색에는 `랜딩 페이지 조회 → 강좌 상세 선택 → 신청서 이동` 보고서도 구성했습니다.

Meta 비즈니스 포트폴리오 `클라우드시큐리티랩`(비즈니스 ID `1732980947720408`)과 웹 데이터 세트 `클씨랩 AI 클래스 웹 전환`을 생성했습니다. Meta Pixel ID는 `2173864043186723`이며, 공통 `marketing-events.js`에서 개인정보 없이 다음 이벤트를 전송합니다.

- `PageView`: 공개 페이지 조회
- `ViewContent`: Gemini 노트북·로블록스 강좌 상세 조회
- `CourseSelect`: 메인 화면에서 강좌 선택
- `ApplyClick`: 신청서 이동 클릭. 실제 신청 완료가 아님
- `Contact`: 카카오톡 문의 클릭
- `MapClick`, `PrintPoster`: 지도 및 A4 인쇄 행동

실제 신청 완료는 기존 Google Form Apps Script의 GA4 `application_submit`으로 확인합니다. 네이버 검색광고는 운영 대상에서 제외했습니다.

업무용 이메일 `yeoneunkim@cloudsecuritylab.co.kr`이 비즈니스 포트폴리오의
프로필 연락처로 연결되어 있습니다. Meta 비즈니스 인증 상태는 별도 항목이며
2026년 7월 24일 확인 기준 `인증되지 않음`입니다.

2026년 7월 24일 광고 계정 `클씨랩 AI 클래스 광고`
(`1661899158952556`)을 비즈니스 포트폴리오에 연결하고 결제수단과 SMS 인증을
완료했습니다. 같은 날 광고 세트 일 예산 `20,000원`, 계정 지출 한도
`140,000원`을 확인했습니다.

현재 Meta 광고 설정:

- 동일 캠페인과 광고 세트 안에서 광고 2개 운영
- 지역은 소사역 중심 약 8km 통학 가능 범위
- Meta 직접 노출 연령은 18~24세
- 로블록스 이미지 광고는 `roblox_youth` 링크 사용
- 두 과정 통합 쇼츠 광고는 `combined_courses_shorts` 링크 사용
- 실제 신청 완료는 GA4 `application_submit`으로 판단

## Google Search Console

2026년 7월 23일 URL 접두어 속성
`https://gasbugs.github.io/dalnayou-class-landing/`을 등록했고, Google 애널리틱스·Google 태그 관리자로 소유권을 자동 확인했습니다.

- 메인 페이지: Google 색인 생성 완료 상태 확인
- `notebooklm.html`: 색인 생성 요청 완료
- `roblox.html`: 색인 생성 요청 완료
- `refund.html`: 색인 생성 요청 완료
- `sitemap.xml`: 기존 제출이 `가져올 수 없음` 상태라 2026년 7월 24일 `sitemap.xml` 경로로 다시 제출했습니다. Search Console이 제출 완료를 확인했으며 Google 재처리 결과는 추후 확인해야 합니다.

## 내부 운영자 트래픽

Direct 유입에는 운영자와 직원의 점검 방문이 포함될 수 있으므로 실제 고객 전환과 분리합니다. 고정 IP를 사용하는 환경에서는 GA4 데이터 스트림의 내부 트래픽 규칙과 데이터 필터를 사용합니다. 유동 IP 환경에서는 운영자 전용 테스트 링크와 DebugView를 사용하고, Direct의 주요 이벤트를 광고 성과로 해석하지 않습니다.
