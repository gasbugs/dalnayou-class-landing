# CLOUD SECURITY LAB · 주말 4주 AI 정규 과정 — 랜딩 페이지

> NotebookLM·로블록스 주말 4주 학원형 정규 과정의 공개 랜딩 페이지.
> GitHub Pages로 호스팅됩니다.

🌐 **라이브 URL**: https://gasbugs.github.io/dalnayou-class-landing/

## 파일 구조
- `index.html` — 메인 랜딩 페이지 (Hero · 강좌 · 가격 · FAQ · CTA)
- `poster.html` — A4 인쇄용 포스터 페이지
- `refund.html` — 환불 정책 페이지
- `cardnews/` — 카드뉴스 미리보기, PNG, ZIP, 원본 HTML
- `scripts/render-cardnews.sh` — `cardnews/source.html`에서 카드뉴스 PNG/ZIP 재생성
- `skills/dalnayou-landing-ops/` — 문구·A4·카드뉴스·UTM·GA4·배포를 반복 운영하는 Codex 스킬
- `tracking-links.md` — 인스타·당근·유튜브·카카오용 UTM 추적 링크
- `campaign-pricing.js` — 날짜에 따라 1차·2차 얼리버드와 파이널 등록 가격을 자동 전환
- `marketing-events.js` — Meta Pixel 공통 로더와 개인정보 없는 웹 행동 이벤트 연결
- `scripts/build-site.sh` — 승인된 공개 페이지와 실제 사용 자산만 `dist/`에 구성
- `images/` — 페이지 이미지 자산

## 기술
- Tailwind CSS (Play CDN)
- Pretendard 폰트 (CDN)
- 순수 HTML/CSS — 빌드 도구 없음

## 유입 분석
- Google 태그 `G-6W058PFM90`이 GA4 측정 정본이며, GTM 컨테이너 `GTM-KVC6H3SL`은 향후 전환용으로 유지합니다.
- 신청서 클릭, 실제 신청 완료, 카카오톡 문의, 지도, 포스터 인쇄, 카드뉴스 다운로드·복사 이벤트를 수집합니다.
- 기존 Google 신청 폼은 유입 정보를 자동으로 받아 Apps Script에서 `application_submit` 이벤트로 전달합니다. 이름과 전화번호는 GA4로 보내지 않습니다.
- Meta Pixel은 `PageView`, `ViewContent`, `CourseSelect`, `ApplyClick`, `Contact`를 수집합니다. `ApplyClick`은 신청서 이동이며 실제 신청 완료를 의미하지 않습니다.
- 채널별 홍보 링크는 `tracking-links.md`를 사용하세요.

## 수정 방법
1. `index.html` 또는 `refund.html` 직접 편집
2. 카드뉴스 문구는 `cardnews/source.html` 수정 후 `./scripts/render-cardnews.sh` 실행
3. `bash scripts/build-site.sh`로 공개 산출물 확인
4. 커밋 후 푸시
5. GitHub Pages가 `dist/`를 자동 배포

## 운영 자동 점검

```bash
skills/dalnayou-landing-ops/scripts/audit-site.sh .
```

개인 Codex에 `dalnayou-landing-ops` 스킬을 설치하면 랜딩 수정 범위 확인부터 모바일·A4 검증, UTM·GA4 점검, GitHub Pages 실배포 확인까지 같은 운영 루프로 반복할 수 있습니다.

## 문의
- 카카오톡: http://pf.kakao.com/_xeKJxen/chat
