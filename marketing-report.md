# 클씨랩 AI 클래스 퍼널 보고서

원본: `marketing/snapshots.jsonl` · 최신 기록: 2026-07-27T16:31:48+09:00

서로 다른 분석 시스템의 수치는 동일 코호트가 아니므로 서로 나눠 전환율을 만들지 않습니다.
판정 기준은 초기 모집용 운영 휴리스틱이며 보편적인 업계 기준이 아닙니다.

## 최신 스냅샷

| 기간 | 소재 | 지출 | 노출 | 링크 클릭 | CTR | 랜딩 | 클릭→랜딩 | 신청 이동 | 제출 | 입금 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-07-24~2026-07-26 | `all_paid_ads` | 22,302원 | 5,705 | 36 | 0.6% | 19 | 52.8% | — | — | — |
| 2026-07-24~2026-07-26 | `combined_courses_shorts` | 16,012원 | 4,056 | 27 | 0.7% | 14 | 51.9% | — | — | — |
| 2026-07-24~2026-07-26 | `roblox_youth` | 6,290원 | 1,649 | 9 | 0.5% | 5 | 55.6% | — | — | — |
| 2026-07-24~2026-07-24 | `ga4_paid_processed_absolute` | — | — | — | — | 93 | — | 0 | 0 | — |
| unknown~2026-07-27 | `all_form_responses` | — | — | — | 비교 금지 | — | 비교 금지 | — | 3 | 3 |
| 2026-07-25~2026-07-26 | `account_1272476857609072_instagram_boost` | 23,058원 | 3,486 | 76 | 2.2% | 71 | 93.4% | — | — | — |
| 2026-07-25~2026-07-26 | `account_1661899158952556_existing_campaign` | 23,485원 | 5,974 | 37 | 0.6% | 22 | 59.5% | — | — | — |
| 2026-07-25~2026-07-26 | `all_active_meta_accounts_before_replacement` | 46,543원 | 9,460 | 113 | 1.2% | 93 | 82.3% | — | — | — |
| 2026-07-19~2026-07-25 | `ga4_latest_processed_7d` | — | — | — | — | 544 | — | 5 | 2 | — |
| unknown~2026-07-26 | `all_courses_payment_confirmed` | — | — | — | — | — | — | — | — | 3 |
| 2026-07-26~2026-07-27 | `notebooklm_enterprise_emergency` | 17,156원 | 4,622 | 26 | 0.6% | 24 | 92.3% | 1 | — | — |
| 2026-07-26~2026-07-27 | `roblox_enterprise_emergency` | 16,784원 | 5,027 | 35 | 0.7% | 33 | 94.3% | 2 | — | — |
| 2026-07-26T10:17:26+09:00~2026-07-26T10:47:26+09:00 | `ga4_realtime_30m_mixed` | — | — | — | — | 3 | — | — | — | — |
| 2026-07-24~2026-07-26 | `ga4_processed_mixed` | — | — | — | — | — | — | 4 | 0 | — |
| 2026-07-27~2026-07-27 | `ga4_today_processed_mixed` | — | — | — | — | 25 | — | 0 | 0 | — |

## CTA 위치별 성과

| 기간 | 과정·위치 | CTA 노출 | 신청 클릭 | 노출→신청 | 출처 |
| --- | --- | ---: | ---: | ---: | --- |
| 2026-07-26T10:17:26+09:00~2026-07-26T10:47:26+09:00 | `ga4_realtime_30m_mixed` | 1 | — | — | ga4 |

## 과정별 실행 판단

실험: `E-009` · 6명은 개강 기준, 15명은 광고 중단 기준, 15명은 과정 정원입니다.

| 과정 | 지출 판단선 | 랜딩 판단선 | 신청 이동 | 입금 / 개강선 | 입금 / 광고중단 | 입금 / 정원 | 현재 조치 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Gemini 노트북 | 17,156 / 40,000 (42.9%) | 24 / 30 (80.0%) | 1 | 확인 필요 | 확인 필요 | 확인 필요 | **관찰 유지** |
| 로블록스 AI | 16,784 / 40,000 (42.0%) | 33 / 30 (100.0%) | 2 | 확인 필요 | 확인 필요 | 확인 필요 | **신청 이후 단계 점검** |


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
| 2026-07-26T09:04:09+09:00 | `account_1272476857609072_instagram_boost` | 23,058원 | 3,486 | 76 | 71 | meta |
| 2026-07-26T09:04:09+09:00 | `account_1661899158952556_existing_campaign` | 23,485원 | 5,974 | 37 | 22 | meta |
| 2026-07-26T09:04:09+09:00 | `all_active_meta_accounts_before_replacement` | 46,543원 | 9,460 | 113 | 93 | meta |
| 2026-07-26T09:04:09+09:00 | `ga4_latest_processed_7d` | — | — | — | 544 | ga4 |
| 2026-07-26T09:04:09+09:00 | `all_courses_payment_confirmed` | — | — | — | — | operator_report |
| 2026-07-26T09:39:57+09:00 | `notebooklm_enterprise_emergency` | — | — | — | 1 | meta |
| 2026-07-26T09:39:57+09:00 | `roblox_enterprise_emergency` | — | — | — | 1 | meta |
| 2026-07-26T09:48:00+09:00 | `ga4_realtime_30m_mixed` | — | — | — | 7 | ga4 |
| 2026-07-26T09:52:05+09:00 | `notebooklm_enterprise_emergency` | 1,022원 | 231 | 2 | 2 | meta |
| 2026-07-26T09:52:05+09:00 | `roblox_enterprise_emergency` | 847원 | 157 | 2 | 2 | meta |
| 2026-07-26T10:15:43+09:00 | `notebooklm_enterprise_emergency` | 1,242원 | 274 | 2 | 2 | meta |
| 2026-07-26T10:15:43+09:00 | `roblox_enterprise_emergency` | 1,180원 | 223 | 4 | 4 | meta |
| 2026-07-26T10:15:43+09:00 | `ga4_realtime_30m_mixed` | — | — | — | 1 | ga4 |
| 2026-07-26T10:15:43+09:00 | `all_form_responses` | — | — | — | — | google_forms |
| 2026-07-26T10:47:26+09:00 | `notebooklm_enterprise_emergency` | 1,704원 | 374 | 3 | 3 | meta |
| 2026-07-26T10:47:26+09:00 | `roblox_enterprise_emergency` | 1,418원 | 259 | 5 | 5 | meta |
| 2026-07-26T10:47:26+09:00 | `ga4_realtime_30m_mixed` | — | — | — | 3 | ga4 |
| 2026-07-26T10:47:26+09:00 | `all_form_responses` | — | — | — | — | google_forms |
| 2026-07-26T12:55:00+09:00 | `notebooklm_enterprise_emergency` | 3,249원 | 638 | 3 | 3 | meta |
| 2026-07-26T12:55:00+09:00 | `roblox_enterprise_emergency` | 2,528원 | 525 | 6 | 5 | meta |
| 2026-07-26T12:55:00+09:00 | `ga4_processed_mixed` | — | — | — | — | ga4 |
| 2026-07-26T12:55:00+09:00 | `all_form_responses` | — | — | — | — | google_forms + operator_report |
| 2026-07-26T13:34:11+09:00 | `notebooklm_enterprise_emergency` | 3,470원 | — | — | 3 | meta |
| 2026-07-26T13:34:11+09:00 | `roblox_enterprise_emergency` | 2,984원 | — | — | 6 | meta |
| 2026-07-26T13:43:29+09:00 | `notebooklm_enterprise_emergency` | 3,612원 | 769 | 3 | 3 | meta |
| 2026-07-26T13:43:29+09:00 | `roblox_enterprise_emergency` | 3,360원 | 841 | 6 | 6 | meta |
| 2026-07-26T13:43:29+09:00 | `all_form_responses` | — | — | — | — | google_forms + operator_report |
| 2026-07-26T13:51:17+09:00 | `ga4_today_processed_mixed` | — | — | — | 33 | ga4 |
| 2026-07-26T14:04:23+09:00 | `notebooklm_enterprise_emergency` | 4,074원 | 858 | 4 | 4 | meta |
| 2026-07-26T14:04:23+09:00 | `roblox_enterprise_emergency` | 3,755원 | 999 | 7 | 7 | meta |
| 2026-07-26T14:04:23+09:00 | `all_form_responses` | — | — | — | — | google_forms + operator_report |
| 2026-07-26T14:36:37+09:00 | `notebooklm_enterprise_emergency` | 4,425원 | 962 | 4 | 4 | meta |
| 2026-07-26T14:36:37+09:00 | `roblox_enterprise_emergency` | 4,416원 | 1,240 | 9 | 10 | meta |
| 2026-07-26T14:36:37+09:00 | `all_form_responses` | — | — | — | — | google_forms + operator_report |
| 2026-07-26T14:55:56+09:00 | `notebooklm_enterprise_emergency` | 4,854원 | 1,082 | 4 | 4 | meta |
| 2026-07-26T14:55:56+09:00 | `roblox_enterprise_emergency` | 5,193원 | 1,448 | 10 | 10 | meta |
| 2026-07-26T20:43:33+09:00 | `notebooklm_enterprise_emergency` | 12,776원 | 3,372 | 21 | 20 | meta |
| 2026-07-26T20:43:33+09:00 | `roblox_enterprise_emergency` | 11,805원 | 3,546 | 25 | 23 | meta |
| 2026-07-26T20:43:33+09:00 | `ga4_today_processed_mixed` | — | — | — | 58 | ga4 |
| 2026-07-26T20:43:33+09:00 | `all_form_responses` | — | — | — | — | google_forms + operator_report |
| 2026-07-27T16:01:29+09:00 | `notebooklm_enterprise_emergency` | 17,156원 | 4,622 | 26 | 24 | meta + ga4 |
| 2026-07-27T16:01:29+09:00 | `roblox_enterprise_emergency` | 16,784원 | 5,027 | 35 | 33 | meta + ga4 |
| 2026-07-27T16:31:48+09:00 | `ga4_today_processed_mixed` | — | — | — | 25 | ga4 |
| 2026-07-27T16:31:48+09:00 | `all_form_responses` | — | — | — | — | google_forms + operator_report |

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
- 기록: Google Form response count remains 3: NotebookLM 2 and Roblox 1. The operator-reported aggregate paid count remains 3, but the per-course payment split is unknown and is not inferred. Applicant PII is intentionally excluded.

### account_1272476857609072_instagram_boost

- 광고 클릭: **관찰 양호** (2.2%)
- 랜딩 완료: **관찰 양호** (93.4%)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 유료 랜딩 30회까지 관찰을 계속합니다.
- 기록: Exact Meta account-level observation before the Instagram-created campaign was paused. CPC 303.39 KRW, link CTR 2.180%, landing-view cost 324.76 KRW.

### account_1661899158952556_existing_campaign

- 광고 클릭: **개선 필요** (0.6%)
- 랜딩 완료: **개선 필요** (59.5%)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 첫 개선 후보: 광고의 첫 문장·대표 이미지·대상 문제를 우선 점검
- 기록: Exact aggregate for the existing CSL campaign before it was paused. Combined short: 18,017 KRW, 4,551 impressions, 27 clicks, 15 landing views. Roblox image: 5,468 KRW, 1,423 impressions, 10 clicks, 7 landing views.

### all_active_meta_accounts_before_replacement

- 광고 클릭: **관찰 양호** (1.2%)
- 랜딩 완료: **관찰 양호** (82.3%)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 유료 랜딩 30회까지 관찰을 계속합니다.
- 기록: Exact sum of two independently active Meta ad accounts before replacement. This is an account inventory total, not a single-campaign cohort.

### ga4_latest_processed_7d

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **개선 필요** (0.9%)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 첫 개선 후보: 결과물·신뢰·가격 근거·일정 적합성과 CTA 위치를 점검
- 기록: Latest fully processed GA4 seven-day report: page_view 544, session_start 383, first_visit 331, course_click 50 from 18 users, apply_click 5 from 3 users, application_submit 2 from 2 users. These GA4 event totals are not divided into Meta metrics.

### all_courses_payment_confirmed

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 노출 1,000회까지 관찰을 계속합니다.
- 기록: User-reported aggregate paid count only. Course split and applicant PII remain in the operator's private ledger and are not stored here.

### notebooklm_enterprise_emergency

- 광고 클릭: **개선 필요** (0.6%)
- 랜딩 완료: **관찰 양호** (92.3%)
- 신청서 이동: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 신청서 제출: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 입금 확정: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 현재 첫 개선 후보: 광고의 첫 문장·대표 이미지·대상 문제를 우선 점검
- 데이터 한계: meta + ga4 혼합 집계이므로 동일 사용자 코호트가 아닙니다.
- 기록: Meta cumulative values for July 26-27 after a manual refresh: status active, link CTR 0.56%, landing-view cost 715 KRW. The apply-click count is the latest processed GA4 evidence through July 26 for this exact campaign content; it proves nonzero form entry but is not divided by the later Meta landing count.

### roblox_enterprise_emergency

- 광고 클릭: **개선 필요** (0.7%)
- 랜딩 완료: **관찰 양호** (94.3%)
- 신청서 이동: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 신청서 제출: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 입금 확정: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 현재 첫 개선 후보: 광고의 첫 문장·대표 이미지·대상 문제를 우선 점검
- 데이터 한계: meta + ga4 혼합 집계이므로 동일 사용자 코호트가 아닙니다.
- 기록: Meta cumulative values for July 26-27 after a manual refresh: status active, link CTR 0.70%, landing-view cost 509 KRW. Roblox crossed the 30-landing review gate, but the latest processed GA4 evidence through July 26 contains two apply clicks for this exact campaign content, so the zero-click replacement rule does not apply. The two systems are not divided into a conversion rate.

### ga4_realtime_30m_mixed

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 노출 1,000회까지 관찰을 계속합니다.
- 기록: GA4 realtime mixed-traffic observation: 2 active users, 3 course_landing_view events, 2 Gemini page views and 1 Roblox page view, and 1 apply_cta_view. apply_click and application_submit were not listed and remain null rather than processed zeros.

### ga4_processed_mixed

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 노출 1,000회까지 관찰을 계속합니다.
- 기록: Processed GA4 report across mixed traffic: apply_click 4 events from 3 users; application_submit 0. Course page views were 60 for Roblox and 35 for NotebookLM under the canonical project path. Do not attribute these mixed counts to Meta without matching UTM data.

### ga4_today_processed_mixed

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 노출 1,000회까지 관찰을 계속합니다.
- 기록: Partial-day GA4 standard report observed at 16:31 KST: course_landing_view 25 events from 23 users, apply_click 0, application_submit 0 and 0 active users in the last 30 minutes. This is an explicit same-day report zero, not an inferred value. Course-level attribution is not available in this observation.

## 실험 실행 게이트

### E-005 · 결제자까지 포함하는 연령 상한 확장

- 준비 상태: `superseded_by_emergency_recruitment`
- 단일 변경: Meta 광고 세트 연령을 18~24세에서 18~44세로 확장
- 현재 판정: **중지**
- 유지 변수: campaign, ad_set, creative, destination, region, daily_budget, account_spend_limit

### E-007 · 모바일 고정 CTA 신청 집중형

- 준비 상태: `paused_during_emergency_recruitment`
- 단일 변경: 모바일 고정 바의 공유 버튼을 제거하고 신청 버튼 비중을 확대
- 미리보기: `experiments/e-007-mobile-cta-preview.html`
- 현재 판정: **중지**
- 유지 변수: ad_audience, creative, destination, budget, hero_copy, application_form

### E-009 · 과정별 기업교육 신뢰형 긴급 모집

- 준비 상태: `live_delivery_confirmed`
- 단일 변경: Gemini 노트북과 로블록스 AI를 각각 일 20,000원, 18~44세, 소사역 +8km, 과정별 직접 랜딩과 기업교육 신뢰형 소재로 분리
- 현재 판정: **실행 중**
- 유지 변수: price, schedule, location, application_form, refund_policy

### E-010 · Google Form 모바일 첫 화면 압축

- 준비 상태: `queued`
- 단일 변경: 신청서 설명에서 랜딩페이지와 중복되는 기관 이력·상세 가격 문장을 줄여 첫 필수 질문을 더 빨리 보이게 함
- 실행 문안: 신청서 설명 5줄 준비
- 표본 게이트: 0 / 10 (10회 부족)
- 시간 게이트: 2026-07-27T20:00:00+09:00 (대기)
- 현재 판정: **대기**
- 추가 조건: application_submits remains 0 and Google Form response count does not increase
- 유지 변수: course_options, required_contact_fields, privacy_consent, price, schedule, location, application_attribution, landing_pages, ad_audience, ad_creative, ad_budget

### E-011 · Gemini 노트북 업무 문서 문제형 소재

- 준비 상태: `prepared_not_live`
- 단일 변경: 도구 소개형 첫 인상을 쌓인 회의록·보고서 정리 문제와 직장인 업무 장면 중심으로 교체
- 미리보기: `experiments/e-011-notebook-workload-ad-preview.html`
- 실행 자산: feed=`experiments/assets/e-011-notebook-workload-feed.png`, story=`experiments/assets/e-011-notebook-workload-story.png`, render_script=`scripts/render-e011-notebook-workload.sh`
- 실행 광고: `[Codex] Gemini노트북_업무문서문제_v2`
- 실행 목적지: `https://gasbugs.github.io/dalnayou-class-landing/notebooklm.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=notebooklm_workload_candidate_v2`
- 표본 게이트: 24 / 30 (6회 부족)
- 시간 게이트: 2026-07-27T20:00:00+09:00 (대기)
- 현재 판정: **대기**
- 추가 조건: Review only when Notebook spend reaches 40,000 KRW or landing views reach 30 and qualified apply-click evidence is absent or stagnant. Publishing is pre-approved within the existing 40,000 KRW total daily budget and August 2 end date; budget increases or date extensions still require separate approval.
- 유지 변수: campaign, ad_set, audience, region, destination, daily_budget, price, schedule, location, application_form, refund_policy

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
