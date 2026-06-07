# CLOUD SECURITY LAB · 주말 4주 AI 정규 과정 — 랜딩 페이지

> NotebookLM·로블록스 주말 4주 학원형 정규 과정의 공개 랜딩 페이지.
> GitHub Pages로 호스팅됩니다.

🌐 **라이브 URL**: https://gasbugs.github.io/dalnayou-class-landing/

## 파일 구조
- `index.html` — 메인 랜딩 페이지 (Hero · 강좌 · 가격 · FAQ · CTA)
- `refund.html` — 환불 정책 페이지
- `tracking-links.md` — 인스타·당근·유튜브·카카오용 UTM 추적 링크
- `images/` — 페이지 이미지 자산

## 기술
- Tailwind CSS (Play CDN)
- Pretendard 폰트 (CDN)
- 순수 HTML/CSS — 빌드 도구 없음

## 유입 분석
- `index.html` 상단의 `window.DALNAYOU_GA4_ID = "";`에 GA4 측정 ID(`G-...`)를 넣으면 페이지뷰와 클릭 이벤트 수집이 시작됩니다.
- 신청서 클릭, 카카오톡 문의 클릭, 쇼츠 섹션 노출 이벤트가 포함되어 있습니다.
- 채널별 홍보 링크는 `tracking-links.md`를 사용하세요.

## 수정 방법
1. `index.html` 또는 `refund.html` 직접 편집
2. 커밋 후 푸시
3. GitHub Pages가 자동 배포 (1~2분)

## 문의
- 카카오톡: http://pf.kakao.com/_xeKJxen/chat
