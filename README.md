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
- `images/` — 페이지 이미지 자산

## 기술
- Tailwind CSS (Play CDN)
- Pretendard 폰트 (CDN)
- 순수 HTML/CSS — 빌드 도구 없음

## 유입 분석
- Google Tag Manager 컨테이너 `GTM-KVC6H3SL`이 메인 랜딩, 포스터, 환불 정책, 카드뉴스 페이지에 설치되어 있습니다.
- 신청서 클릭, 카카오톡 문의 클릭, 지도 클릭, 쇼츠 섹션 노출, 포스터 인쇄, 카드뉴스 다운로드·복사 이벤트를 `dataLayer`로 보냅니다.
- 실제 GA4 수집은 GTM 컨테이너 안에서 GA4 태그와 이벤트 트리거를 연결해야 시작됩니다.
- 채널별 홍보 링크는 `tracking-links.md`를 사용하세요.

## 수정 방법
1. `index.html` 또는 `refund.html` 직접 편집
2. 카드뉴스 문구는 `cardnews/source.html` 수정 후 `./scripts/render-cardnews.sh` 실행
3. 커밋 후 푸시
4. GitHub Pages가 자동 배포 (1~2분)

## 운영 자동 점검

```bash
skills/dalnayou-landing-ops/scripts/audit-site.sh .
```

개인 Codex에 `dalnayou-landing-ops` 스킬을 설치하면 랜딩 수정 범위 확인부터 모바일·A4 검증, UTM·GA4 점검, GitHub Pages 실배포 확인까지 같은 운영 루프로 반복할 수 있습니다.

## 문의
- 카카오톡: http://pf.kakao.com/_xeKJxen/chat
