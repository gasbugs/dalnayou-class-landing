# 클씨랩 AI 클래스 퍼널 보고서

원본: `marketing/snapshots.jsonl` · 최신 기록: 2026-07-26T00:23:59+09:00

서로 다른 분석 시스템의 수치는 동일 코호트가 아니므로 서로 나눠 전환율을 만들지 않습니다.
판정 기준은 초기 모집용 운영 휴리스틱이며 보편적인 업계 기준이 아닙니다.

## 최신 스냅샷

| 기간 | 소재 | 지출 | 노출 | 링크 클릭 | CTR | 랜딩 | 클릭→랜딩 | 신청 이동 | 제출 | 입금 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-07-24~2026-07-26 | `all_paid_ads` | 22,302원 | 5,705 | 36 | 0.6% | 19 | 52.8% | — | — | — |
| 2026-07-24~2026-07-26 | `combined_courses_shorts` | 16,012원 | 4,056 | 27 | 0.7% | 14 | 51.9% | — | — | — |
| 2026-07-24~2026-07-26 | `roblox_youth` | 6,290원 | 1,649 | 9 | 0.5% | 5 | 55.6% | — | — | — |
| 2026-07-24~2026-07-24 | `ga4_paid_processed_absolute` | — | — | — | — | 93 | — | 0 | 0 | — |
| unknown~2026-07-26 | `all_form_responses` | — | — | — | — | — | — | — | 3 | — |

## 관찰 이력

| 기록 시각 | 소재 | 지출 | 노출 | 링크 클릭 | 랜딩 | 출처 |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| 2026-07-25T20:15:00+09:00 | `all_paid_ads` | 약 19,900원 | 5,103 | 30 | 13 | meta + ga4 |
| 2026-07-25T20:15:00+09:00 | `combined_courses_shorts` | 약 14,322원 | 3,643 | 23 | 11 | meta |
| 2026-07-25T20:15:00+09:00 | `roblox_youth` | 약 5,564원 | 1,460 | 7 | 2 | meta |
| 2026-07-25T23:02:39+09:00 | `all_paid_ads` | 21,910원 | 5,598 | 36 | 19 | meta |
| 2026-07-25T23:02:39+09:00 | `combined_courses_shorts` | 15,785원 | 3,988 | 27 | 14 | meta |
| 2026-07-25T23:02:39+09:00 | `roblox_youth` | 6,125원 | 1,610 | 9 | 5 | meta |
| 2026-07-26T00:23:59+09:00 | `all_paid_ads` | 22,302원 | 5,705 | 36 | 19 | meta |
| 2026-07-26T00:23:59+09:00 | `combined_courses_shorts` | 16,012원 | 4,056 | 27 | 14 | meta |
| 2026-07-26T00:23:59+09:00 | `roblox_youth` | 6,290원 | 1,649 | 9 | 5 | meta |
| 2026-07-26T00:23:59+09:00 | `ga4_paid_processed_absolute` | — | — | — | 93 | ga4 |
| 2026-07-26T00:23:59+09:00 | `all_form_responses` | — | — | — | — | google_forms |

## 최신 병목 판정

### all_paid_ads

- 광고 클릭: **개선 필요** (0.6%)
- 랜딩 완료: **개선 필요** (52.8%)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 첫 개선 후보: 광고의 첫 문장·대표 이미지·대상 문제를 우선 점검
- 기록: Fresh Meta Ads Manager refresh at 00:23 KST; exact aggregate values. No new landing views since the previous snapshot; GA4 is intentionally excluded from this cohort.

### combined_courses_shorts

- 광고 클릭: **개선 필요** (0.7%)
- 랜딩 완료: **개선 필요** (51.9%)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 첫 개선 후보: 광고의 첫 문장·대표 이미지·대상 문제를 우선 점검
- 기록: Fresh Meta Ads Manager refresh at 00:23 KST; exact ad-level values.

### roblox_youth

- 광고 클릭: **개선 필요** (0.5%)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 첫 개선 후보: 광고의 첫 문장·대표 이미지·대상 문제를 우선 점검
- 기록: Fresh Meta Ads Manager refresh at 00:23 KST; exact ad-level values.

### ga4_paid_processed_absolute

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **개선 필요** (0.0%)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 첫 개선 후보: 결과물·신뢰·가격 근거·일정 적합성과 CTA 위치를 점검
- 기록: Latest fully processed GA4 day available during review. Paid segment recorded 93 landing users; the standard Events report contained no apply_click or application_submit event. The closed chooser funnel's 3 course selections must not be required for ads that land directly on a course page.

### all_form_responses

- 누적 신청서 제출: **3건**
- 퍼널 판정: **귀속 불가** (자동 유입 정보가 없는 누적 응답)
- 기록: Cumulative aggregate only: 3 responses total, NotebookLM 2 and Roblox 1. All 3 have an empty automatic attribution field, so none is assigned to the current paid campaign. Applicant PII is intentionally excluded.

## 실험 실행 게이트

### E-005 · 결제자까지 포함하는 연령 상한 확장

- 준비 상태: `prepared`
- 단일 변경: Meta 광고 세트 연령을 18~24세에서 18~44세로 확장
- 표본 게이트: 19 / 30 (11회 부족)
- 시간 게이트: 2026-07-27T22:45:00+09:00 (대기)
- 현재 판정: **대기**
- 유지 변수: campaign, ad_set, creative, destination, region, daily_budget, account_spend_limit

### E-007 · 모바일 고정 CTA 신청 집중형

- 준비 상태: `candidate`
- 단일 변경: 모바일 고정 바의 공유 버튼을 제거하고 신청 버튼 비중을 확대
- 실행 순서: E-005 판정 이후에만 검토
- 현재 판정: **대기**
- 유지 변수: ad_audience, creative, destination, budget, hero_copy, application_form

## 운영 규칙

- 새 수치는 기존 줄을 수정하지 않고 JSONL 마지막에 추가합니다.
- Meta 수치와 GA4 수치를 서로 나눠 전환율을 계산하지 않습니다.
- 복수 시스템 기록은 `metric_sources`로 분자와 분모의 출처가 명시된 비율만 계산합니다.
- 과정 선택 페이지 유입은 `page_view → course_click → apply_click` 경로로 봅니다.
- 강좌 상세 직접 유입은 `course_click`을 요구하지 않고 `course_landing_view → apply_click` 경로로 봅니다.
- 절대 `apply_click`과 `application_submit` 수를 함께 확인해 닫힌 퍼널의 거짓 0을 방지합니다.
- CTA 위치별 성과는 같은 `link_position`의 `apply_cta_view → apply_click`로 비교합니다.
- GA4는 보고서를 확인한 날이 아니라 최신 완전 처리일을 명시합니다.
- 광고·랜딩·신청서 변경 시각과 실험 ID는 `marketing-history.md`에 기록합니다.
- `자료 부족`을 실패로 부르지 않습니다.
- 광고비 증액과 랜딩 구조 변경을 동시에 진행하지 않습니다.
- 최종 성과는 `payment_confirmed`로 판단합니다.
