# 클씨랩 AI 클래스 퍼널 보고서

원본: `marketing/snapshots.jsonl` · 최신 기록: 2026-07-28T22:58:57+09:00

서로 다른 분석 시스템의 수치는 동일 코호트가 아니므로 서로 나눠 전환율을 만들지 않습니다.
판정 기준은 초기 모집용 운영 휴리스틱이며 보편적인 업계 기준이 아닙니다.

## 모집 목표 현황

- 위험도: **긴급**
- 입금: **3 / 12명** · 추가 필요 **9명**
- 남은 시간: **121시간** · 목표 달성에 필요한 일평균 입금 **1.79명**
- 과정별 입금 집계: **확인 필요**
- 확정 메시지 발송: **과정별 확인 필요**
- E-010 변경 후: 검증된 신청 이동 **0 / 10회** · 신규 Form 응답 **0건**

| 동일 분석 체계 | CTA 노출 | 신청서 열기 | 노출→신청서 열기 |
| --- | ---: | ---: | ---: |
| GA4 유료 유입 | 167 | 5 | 2.99% |

Meta 랜딩 조회와 GA4 신청 클릭을 나눠 전환율을 만들지 않습니다. `apply_click`은 신청 완료가 아니라 신청서 열기입니다.

## 다음 판단

다음 확인 시각: **2026-07-29T09:00:00+09:00**

- 과정별 입금 15명이 확인되면 해당 광고를 즉시 중단한다. 6명은 개강 최소 인원이며 광고 중단 기준이 아니다.
- E-010 변경 후 검증된 신청 이동이 10회 미만이면 신청서와 운영 랜딩을 유지하고 E-013은 미리보기로만 둔다.
- E-010 변경 후 검증된 신청 이동 10회 전에 신규 Form 응답이 생기면 먼저 입금 요청과 24시간 내 확정 안내를 실행하고 실험은 계속 측정한다.
- E-010 변경 후 검증된 신청 이동이 10회에 도달했는데 신규 Form 응답이 없으면 남은 필수 입력과 제출 흐름을 점검한다.
- E-013은 E-010 판정 표본 충족과 운영자 승인 두 조건을 모두 만족한 뒤에만 운영 페이지에 병합한다.
- 과정별 입금 수가 확인되지 않으면 전체 입금 수를 과정별로 추정하지 않는다.

## 최신 스냅샷

| 기간 | 소재 | 지출 | 노출 | 링크 클릭 | CTR | 랜딩 | 클릭→랜딩 | 신청 이동 | 제출 | 입금 | 확정 발송 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-07-24~2026-07-26 | `all_paid_ads` | 22,302원 | 5,705 | 36 | 0.6% | 19 | 52.8% | — | — | — | — |
| 2026-07-24~2026-07-26 | `combined_courses_shorts` | 16,012원 | 4,056 | 27 | 0.7% | 14 | 51.9% | — | — | — | — |
| 2026-07-24~2026-07-26 | `roblox_youth` | 6,290원 | 1,649 | 9 | 0.5% | 5 | 55.6% | — | — | — | — |
| 2026-07-24~2026-07-24 | `ga4_paid_processed_absolute` | — | — | — | — | 93 | — | 0 | 0 | — | — |
| unknown~2026-07-28 | `all_form_responses` | — | — | — | 비교 금지 | — | 비교 금지 | — | 3 | 3 | — |
| 2026-07-25~2026-07-26 | `account_1272476857609072_instagram_boost` | 23,058원 | 3,486 | 76 | 2.2% | 71 | 93.4% | — | — | — | — |
| 2026-07-25~2026-07-26 | `account_1661899158952556_existing_campaign` | 23,485원 | 5,974 | 37 | 0.6% | 22 | 59.5% | — | — | — | — |
| 2026-07-25~2026-07-26 | `all_active_meta_accounts_before_replacement` | 46,543원 | 9,460 | 113 | 1.2% | 93 | 82.3% | — | — | — | — |
| 2026-07-19~2026-07-25 | `ga4_latest_processed_7d` | — | — | — | — | 544 | — | 5 | 2 | — | — |
| unknown~2026-07-26 | `all_courses_payment_confirmed` | — | — | — | — | — | — | — | — | 3 | — |
| 2026-07-26~2026-07-27 | `notebooklm_enterprise_emergency` | 30,025원 | 8,137 | — | 비교 금지 | 44 | 비교 금지 | 1 | — | — | — |
| 2026-07-27~2026-07-28 | `roblox_enterprise_emergency` | 36,688원 | 10,805 | 57 | 0.5% | 49 | 86.0% | 1 | 0 | — | — |
| 2026-07-26T10:17:26+09:00~2026-07-26T10:47:26+09:00 | `ga4_realtime_30m_mixed` | — | — | — | — | 3 | — | — | — | — | — |
| 2026-07-24~2026-07-26 | `ga4_processed_mixed` | — | — | — | — | — | — | 4 | 0 | — | — |
| 2026-07-27~2026-07-27 | `ga4_today_processed_mixed` | — | — | — | — | 25 | — | 0 | 0 | — | — |
| 2026-07-26~2026-07-27 | `ga4_cta_position_breakdown` | — | — | — | — | — | — | 4 | 0 | — | — |
| 2026-07-26~2026-07-27 | `pre_20_decision_checkpoint` | — | — | — | 비교 금지 | — | 비교 금지 | 4 | 0 | 3 | — |
| 2026-07-27~2026-07-28 | `notebooklm_workload_candidate_v2` | 13,272원 | 3,540 | 21 | 0.6% | 16 | 76.2% | 1 | 0 | — | — |
| 2026-07-26~2026-07-27 | `e011_launch_checkpoint` | — | — | — | 비교 금지 | 101 | 비교 금지 | 4 | 0 | 3 | — |
| 2026-07-26~2026-07-27 | `post_e011_launch_checkpoint` | — | — | — | 비교 금지 | — | 비교 금지 | 4 | 0 | 3 | — |
| 2026-07-26~2026-07-27 | `overnight_checkpoint` | — | — | — | 비교 금지 | — | 비교 금지 | 4 | 0 | 3 | — |
| 2026-07-27~2026-07-28 | `course_adset_checkpoint` | 71,999원 | 20,155 | 118 | 0.6% | 97 | 82.2% | — | — | — | — |
| 2026-07-26~2026-07-28 | `accelerated_roblox_gate_checkpoint` | — | — | — | 비교 금지 | 66 | 비교 금지 | 6 | 0 | 3 | — |
| 2026-07-26~2026-07-28 | `qualified_paid_apply_checkpoint` | — | — | — | 비교 금지 | 97 | 비교 금지 | 6 | 0 | 3 | — |
| 2026-07-26~2026-07-28 | `paid_cta_funnel_notebooklm` | — | — | — | — | — | — | 2 | 0 | — | — |
| 2026-07-26~2026-07-28 | `paid_cta_funnel_roblox` | — | — | — | — | — | — | 3 | 0 | — | — |
| 2026-07-27~2026-07-28 | `roblox_creator_organic_20260727` | 0원 | — | — | — | — | — | — | — | — | — |
| 2026-07-27~2026-07-28 | `notebooklm_workload_organic_20260727` | 0원 | — | — | — | — | — | — | — | — | — |
| 2026-07-26~2026-07-28 | `combined_launch_post` | 0원 | — | — | — | — | — | — | — | — | — |
| 2026-07-26~2026-07-27 | `kakao_channel_inquiry_checkpoint` | 0원 | — | — | — | — | — | — | — | — | — |

## CTA 위치별 성과

| 기간 | 과정·위치 | CTA 노출 | 신청 클릭 | 노출→신청 | 출처 |
| --- | --- | ---: | ---: | ---: | --- |
| 2026-07-26T10:17:26+09:00~2026-07-26T10:47:26+09:00 | `ga4_realtime_30m_mixed` | 1 | — | — | ga4 |
| 2026-07-26~2026-07-27 | `ga4_cta_position_breakdown` | 129 | 4 | 3.1% | ga4 |
| 2026-07-26~2026-07-27 | `pre_20_decision_checkpoint` | 129 | 4 | 비교 금지 | ga4 + google_forms + operator_report |
| 2026-07-26~2026-07-27 | `e011_launch_checkpoint` | 129 | 4 | 비교 금지 | meta + ga4 + google_forms + operator_report |
| 2026-07-26~2026-07-27 | `post_e011_launch_checkpoint` | 129 | 4 | 비교 금지 | ga4 + google_forms + operator_report |
| 2026-07-26~2026-07-27 | `overnight_checkpoint` | 129 | 4 | 비교 금지 | ga4 + google_forms + operator_report |
| 2026-07-26~2026-07-28 | `accelerated_roblox_gate_checkpoint` | 160 | 6 | 3.8% | meta + ga4 + google_forms + operator_report |
| 2026-07-26~2026-07-28 | `qualified_paid_apply_checkpoint` | 167 | 6 | 3.6% | meta + ga4 + google_forms + operator_report |
| 2026-07-26~2026-07-28 | `notebooklm · all_course_ctas` | 76 | 2 | 2.6% | ga4 |
| 2026-07-26~2026-07-28 | `roblox · all_course_ctas` | 91 | 3 | 3.3% | ga4 |

## 과정별 실행 판단

실험: `E-009` · 6명은 개강 기준, 15명은 광고 중단 기준, 15명은 과정 정원입니다.

| 과정 | 지출 판단선 | 랜딩 판단선 | 유효 신청 이동 | 입금 / 개강선 | 입금 / 광고중단 | 입금 / 정원 | 현재 조치 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Gemini 노트북 | 13,272 / 40,000 (33.2%) | 16 / 30 (53.3%) | 1 | 확인 필요 | 확인 필요 | 확인 필요 | **관찰 유지** |
| 로블록스 AI | 36,688 / 40,000 (91.7%) | 49 / 30 (100.0%) | 1 | 확인 필요 | 확인 필요 | 확인 필요 | **신청 이후 단계 점검** |


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
| 2026-07-27T17:10:20+09:00 | `ga4_cta_position_breakdown` | — | — | — | 115 | ga4 |
| 2026-07-27T17:27:44+09:00 | `notebooklm_enterprise_emergency` | 28,447원 | 7,663 | 48 | 43 | meta + ga4 |
| 2026-07-27T17:27:44+09:00 | `roblox_enterprise_emergency` | 27,593원 | 8,191 | 56 | 52 | meta + ga4 |
| 2026-07-27T17:27:44+09:00 | `all_form_responses` | — | — | — | — | google_forms + operator_report |
| 2026-07-27T18:11:35+09:00 | `notebooklm_enterprise_emergency` | 29,291원 | 7,927 | 49 | 44 | meta + ga4 |
| 2026-07-27T18:11:35+09:00 | `roblox_enterprise_emergency` | 28,491원 | 8,489 | 56 | 53 | meta + ga4 |
| 2026-07-27T18:11:35+09:00 | `pre_20_decision_checkpoint` | — | — | — | 115 | ga4 + google_forms + operator_report |
| 2026-07-27T18:35:55+09:00 | `ga4_cta_position_breakdown` | — | — | — | — | ga4 |
| 2026-07-27T18:35:55+09:00 | `all_form_responses` | — | — | — | — | google_forms + operator_report |
| 2026-07-27T19:10:00+09:00 | `notebooklm_enterprise_emergency` | 30,025원 | 8,137 | — | 44 | meta + ga4 |
| 2026-07-27T19:10:00+09:00 | `roblox_enterprise_emergency` | 29,012원 | 8,693 | — | 53 | meta + ga4 |
| 2026-07-27T19:10:00+09:00 | `pre_20_decision_checkpoint` | — | — | — | — | ga4 + google_forms + operator_report |
| 2026-07-27T20:03:00+09:00 | `notebooklm_workload_candidate_v2` | — | — | — | — | meta |
| 2026-07-27T20:03:00+09:00 | `e011_launch_checkpoint` | — | — | — | 101 | meta + ga4 + google_forms + operator_report |
| 2026-07-27T20:30:00+09:00 | `notebooklm_workload_candidate_v2` | — | — | — | 0 | meta |
| 2026-07-27T21:01:00+09:00 | `notebooklm_workload_candidate_v2` | — | — | — | 0 | meta |
| 2026-07-27T21:01:00+09:00 | `post_e011_launch_checkpoint` | — | — | — | — | ga4 + google_forms + operator_report |
| 2026-07-27T22:01:00+09:00 | `notebooklm_workload_candidate_v2` | — | — | — | 0 | meta |
| 2026-07-27T22:01:00+09:00 | `overnight_checkpoint` | — | — | — | — | ga4 + google_forms + operator_report |
| 2026-07-27T22:21:00+09:00 | `notebooklm_workload_candidate_v2` | — | — | — | 0 | meta |
| 2026-07-28T08:42:00+09:00 | `notebooklm_workload_candidate_v2` | — | — | — | 3 | meta |
| 2026-07-28T08:44:00+09:00 | `course_adset_checkpoint` | — | — | — | 66 | meta |
| 2026-07-28T08:45:00+09:00 | `accelerated_roblox_gate_checkpoint` | — | — | — | 66 | meta + ga4 + google_forms + operator_report |
| 2026-07-28T08:54:00+09:00 | `notebooklm_workload_candidate_v2` | — | — | — | 3 | meta + ga4 |
| 2026-07-28T08:54:00+09:00 | `roblox_enterprise_emergency` | — | — | — | 31 | meta + ga4 |
| 2026-07-28T08:54:00+09:00 | `qualified_paid_apply_checkpoint` | — | — | — | 66 | meta + ga4 + google_forms + operator_report |
| 2026-07-28T08:54:00+09:00 | `paid_cta_funnel_notebooklm` | — | — | — | — | ga4 |
| 2026-07-28T08:54:00+09:00 | `paid_cta_funnel_roblox` | — | — | — | — | ga4 |
| 2026-07-28T09:10:00+09:00 | `course_adset_checkpoint` | 50,502원 | 14,018 | 82 | 66 | meta |
| 2026-07-28T22:41:00+09:00 | `course_adset_checkpoint` | 71,999원 | 20,155 | 118 | 97 | meta |
| 2026-07-28T22:41:00+09:00 | `notebooklm_workload_candidate_v2` | 13,272원 | 3,540 | 21 | 16 | meta + ga4 |
| 2026-07-28T22:41:00+09:00 | `roblox_enterprise_emergency` | 36,688원 | 10,805 | 57 | 49 | meta + ga4 |
| 2026-07-28T22:41:00+09:00 | `qualified_paid_apply_checkpoint` | — | — | — | 97 | meta + ga4 + google_forms + operator_report |
| 2026-07-28T22:41:00+09:00 | `paid_cta_funnel_notebooklm` | — | — | — | — | ga4 |
| 2026-07-28T22:41:00+09:00 | `paid_cta_funnel_roblox` | — | — | — | — | ga4 |
| 2026-07-28T22:41:00+09:00 | `all_form_responses` | — | — | — | — | google_forms + operator_report |
| 2026-07-28T22:55:56+09:00 | `roblox_creator_organic_20260727` | 0원 | — | — | — | meta_business_suite |
| 2026-07-28T22:55:56+09:00 | `notebooklm_workload_organic_20260727` | 0원 | — | — | — | meta_business_suite |
| 2026-07-28T22:55:56+09:00 | `combined_launch_post` | 0원 | — | — | — | meta_business_suite |
| 2026-07-28T22:58:57+09:00 | `kakao_channel_inquiry_checkpoint` | 0원 | — | — | — | kakao_business |

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
- 기록: Google Form response count remains three: NotebookLM two and Roblox one. The operator-reported aggregate paid count remains three, but the per-course payment split is unknown and is not inferred. Applicant PII is intentionally excluded.

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

- 광고 클릭: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 랜딩 완료: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 신청서 이동: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 신청서 제출: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 입금 확정: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 현재 판단: 다음 퍼널 단계의 절대 전환 수와 입금 확정을 확인합니다.
- 데이터 한계: meta + ga4 혼합 집계이므로 동일 사용자 코호트가 아닙니다.
- 기록: 19:10 KST checkpoint. Meta totals were read at about 19:05 KST and the ads table still showed 44 landing-page views at 19:10. The only raw exact-content apply click remains excluded as United States or QA traffic. The replacement draft is saved but unpublished until the documented 20:00 decision gate.

### roblox_enterprise_emergency

- 광고 클릭: **개선 필요** (0.5%)
- 랜딩 완료: **관찰 양호** (86.0%)
- 신청서 이동: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 현재 첫 개선 후보: 광고의 첫 문장·대표 이미지·대상 문제를 우선 점검
- 데이터 한계: meta + ga4 혼합 집계이므로 동일 사용자 코호트가 아닙니다.
- 기록: The active Roblox enterprise-trust ad reached 49 landing-page views. GA4 still shows one qualified paid non-US course-tagged Roblox apply click and no application_submit. E-012 remains held while the Google Form E-010 experiment is running.

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

### ga4_cta_position_breakdown

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 노출 1,000회까지 관찰을 계속합니다.
- 기록: GA4 Exploration refreshed at 18:35 KST for July 26-27. CTA views are Roblox mobile 48, Notebook mobile 41, Roblox hero 13, Notebook hero 12, Roblox enterprise trust 8, Notebook enterprise trust 3, Roblox final 3 and Notebook final 1. Apply clicks remain four: Notebook hero 1, Notebook mobile 1, Roblox final 1 and Roblox mobile 1. No application_submit row is present, so processed tracked submissions remain 0. The single new CTA view without a click does not change either experiment gate.

### pre_20_decision_checkpoint

- 누적 신청서 제출: **0건**
- 퍼널 판정: **귀속 불가** (자동 유입 정보가 없는 누적 응답)
- 기록: At 19:10 KST the GA4 CTA-position exploration remained at 129 CTA views, four raw apply clicks and zero tracked application_submit events. Google Form responses remained three. The operator-reported paid total remains three with no authoritative course split, so it is not used for a course-level capacity stop. Six paid learners confirms a course can run; only 15 paid learners in a specific course stops that course ad.

### notebooklm_workload_candidate_v2

- 광고 클릭: **개선 필요** (0.6%)
- 랜딩 완료: **관찰 양호** (76.2%)
- 신청서 이동: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **비교 금지** (서로 다른 집계 시스템 또는 출처 불명)
- 현재 첫 개선 후보: 광고의 첫 문장·대표 이미지·대상 문제를 우선 점검
- 데이터 한계: meta + ga4 혼합 집계이므로 동일 사용자 코호트가 아닙니다.
- 기록: The active Gemini workload candidate recorded 16 landing-page views after publication. GA4 still shows one qualified paid non-US course-tagged NotebookLM apply click and no application_submit. The superseded enterprise-trust ad remains off.

### e011_launch_checkpoint

- 누적 신청서 제출: **0건**
- 퍼널 판정: **귀속 불가** (자동 유입 정보가 없는 누적 응답)
- 기록: 20:00 KST decision checkpoint: Meta showed 46 cumulative Gemini and 55 cumulative Roblox landing-page views after a manual refresh. GA4 remained at 129 CTA views and four raw apply clicks, with no application_submit row. Google Form responses remained three and the operator-reported paid total remained three without an authoritative course split. The deterministic decision therefore launched E-011, kept the Form stable, and kept both course ad sets recruiting because neither has verified 15-person paid capacity.

### post_e011_launch_checkpoint

- 누적 신청서 제출: **0건**
- 퍼널 판정: **귀속 불가** (자동 유입 정보가 없는 누적 응답)
- 기록: At 21:01 KST GA4 remained at 129 CTA views and four raw apply clicks with no application_submit row. Google Form responses remained three. The operator-reported paid total remains three without an authoritative course split. No course has verified 15-person capacity, so both course ad sets continue recruiting.

### overnight_checkpoint

- 누적 신청서 제출: **0건**
- 퍼널 판정: **귀속 불가** (자동 유입 정보가 없는 누적 응답)
- 기록: At 22:01 KST GA4 remained at 129 CTA views and four raw apply clicks with no application_submit row. Google Form responses remained three. The operator-reported paid total remains three without a course split. Both course ads continue because neither has verified 15-person paid capacity.

### course_adset_checkpoint

- 광고 클릭: **개선 필요** (0.6%)
- 랜딩 완료: **관찰 양호** (82.2%)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 첫 개선 후보: 광고의 첫 문장·대표 이미지·대상 문제를 우선 점검
- 기록: Refreshed Meta ad-set and ad-level reports at 22:41 KST. Gemini recorded 35,311 KRW, 9,350 impressions, 61 link clicks and 48 landing-page views. Roblox recorded 36,688 KRW, 10,805 impressions, 57 link clicks and 49 landing-page views. Both ad sets remain active at 20,000 KRW/day. No budget, audience, destination or schedule setting was changed.

### accelerated_roblox_gate_checkpoint

- 누적 신청서 제출: **0건**
- 퍼널 판정: **귀속 불가** (자동 유입 정보가 없는 누적 응답)
- 기록: The user advanced the Roblox decision gate by 20 minutes. GA4 shows four historical course-unset apply clicks plus one newly course-tagged click for each course, but paid-source and local qualification are not yet proven. Google Form responses remain three. E-012 stays unpublished until the new Roblox click attribution is resolved; both course ads continue because neither has verified 15-person paid capacity.

### qualified_paid_apply_checkpoint

- 누적 신청서 제출: **0건**
- 퍼널 판정: **귀속 불가** (자동 유입 정보가 없는 누적 응답)
- 기록: At 22:41 KST, the GA4 paid-traffic exploration shows 167 application CTA views and five paid apply clicks. The full exploration still contains six apply clicks, including one qualified paid non-US course-tagged click per course, and no application_submit. Google Form responses remain three. E-010 has accumulated zero additional qualified apply clicks after launch.

### paid_cta_funnel_notebooklm

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 노출 1,000회까지 관찰을 계속합니다.
- 기록: Within the GA4 paid-traffic segment, NotebookLM has 76 application CTA views and two form-open clicks, a 2.63% view-to-click rate. One course-tagged click is qualified as paid and non-US. This is not a completed application.

### paid_cta_funnel_roblox

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 노출 1,000회까지 관찰을 계속합니다.
- 기록: Within the GA4 paid-traffic segment, Roblox has 91 application CTA views and three form-open clicks, a 3.30% view-to-click rate. One course-tagged click is qualified as paid and non-US. This is not a completed application.

### roblox_creator_organic_20260727

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 노출 1,000회까지 관찰을 계속합니다.
- 기록: The free public Roblox creator follow-up post reached two people and recorded five views from two viewing accounts. It had no reactions, comments, shares or saves. Meta displayed no usable link-click value. Do not repeat the same Page-post strategy as a recruitment lever.

### notebooklm_workload_organic_20260727

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 노출 1,000회까지 관찰을 계속합니다.
- 기록: The free public Gemini Notebook workload follow-up post reached two people and recorded seven views from two viewing accounts. It had no reactions, comments, shares or saves. Meta displayed no usable link-click value. Do not repeat the same Page-post strategy as a recruitment lever.

### combined_launch_post

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 노출 1,000회까지 관찰을 계속합니다.
- 기록: The free public combined launch post reached four people and recorded five views from three viewing accounts. It had no reactions, comments, shares or saves. Meta displayed no usable link-click value. Organic Page distribution is too small to justify another similar post.

### kakao_channel_inquiry_checkpoint

- 광고 클릭: **자료 부족** (노출 1,000회)
- 랜딩 완료: **자료 부족** (링크 클릭 20회)
- 신청서 이동: **자료 부족** (유료 랜딩 30회)
- 신청서 제출: **자료 부족** (신청서 이동 10회)
- 입금 확정: **자료 부족** (신청서 제출 3회)
- 현재 판단: 노출 1,000회까지 관찰을 계속합니다.
- 기록: Kakao Business processed statistics show zero profile visitors and zero profile views on both July 26 and July 27, with no new campaign-period chat. The channel has three total friends. July 28 data is not yet processed and is intentionally not recorded as zero. Chat is enabled daily from 09:00 to 18:00 and accepts an away message outside those hours.

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

- 준비 상태: `running`
- 단일 변경: 신청서 설명에서 랜딩페이지와 중복되는 기관 이력·상세 가격 문장을 줄여 첫 필수 질문을 더 빨리 보이게 함
- 실행 문안: 신청서 설명 7줄 준비
- 표본 게이트: 0 / 10 (10회 부족)
- 시간 게이트: 2026-07-27T20:00:00+09:00 (충족)
- 현재 판정: **대기**
- 추가 조건: application_submits remains 0 and Google Form response count does not increase
- 유지 변수: course_options, required_contact_fields, privacy_consent, price, schedule, location, application_attribution, landing_pages, ad_audience, ad_creative, ad_budget

### E-011 · Gemini 노트북 업무 문서 문제형 소재

- 준비 상태: `published_active`
- 단일 변경: 도구 소개형 첫 인상을 쌓인 회의록·보고서 정리 문제와 직장인 업무 장면 중심으로 교체
- 미리보기: `experiments/e-011-notebook-workload-ad-preview.html`
- 실행 자산: feed=`experiments/assets/e-011-notebook-workload-feed.png`, story=`experiments/assets/e-011-notebook-workload-story.png`, render_script=`scripts/render-e011-notebook-workload.sh`, photo_source=`experiments/assets/notebooklm-workplace-generic-v2.webp`
- 실행 광고: `[Codex] Gemini노트북_업무문서문제_v2`
- 실행 목적지: `https://gasbugs.github.io/dalnayou-class-landing/notebooklm.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=notebooklm_workload_candidate_v2`
- 표본 게이트: 44 / 30 (충족)
- 시간 게이트: 2026-07-27T20:00:00+09:00 (충족)
- 현재 판정: **실행 검토 가능**
- 추가 조건: Review only when Notebook spend reaches 40,000 KRW or landing views reach 30 and qualified apply-click evidence is absent or stagnant. Publishing is pre-approved within the existing 40,000 KRW total daily budget and August 2 end date; budget increases or date extensions still require separate approval.
- 유지 변수: campaign, ad_set, audience, region, destination, daily_budget, price, schedule, location, application_form, refund_policy

### E-012 · 로블록스 실제 결과물 진행형 소재

- 준비 상태: `held_qualified_paid_click`
- 단일 변경: 생성 이미지 중심의 완성 약속을 실제 수업 결과 화면 3개와 1주차·3주차·4주차 진행 과정으로 교체
- 미리보기: `experiments/e-012-roblox-real-output-ad-preview.html`
- 실행 자산: feed=`experiments/assets/e-012-roblox-real-output-feed.png`, story=`experiments/assets/e-012-roblox-real-output-story.png`, render_script=`scripts/render-e012-roblox-real-output.sh`, photo_sources=`images/house2-v3.webp,images/park-v2.webp,images/publish-v2.webp`
- 실행 광고: `[Codex] 로블록스AI_실제결과물_v2`
- 실행 목적지: `https://gasbugs.github.io/dalnayou-class-landing/roblox.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=dalnayou_2026_08&utm_content=roblox_real_output_candidate_v2`
- 표본 게이트: 49 / 30 (충족)
- 시간 게이트: 2026-07-28T08:40:00+09:00 (충족)
- 현재 판정: **실행 검토 가능**
- 추가 조건: At the user-accelerated 2026-07-28 08:40 KST checkpoint, launch only if qualified Roblox apply-click evidence is absent or stagnant, no recent click is awaiting attribution, and no course-specific 15-person paid-capacity stop is proven. Publishing is pre-approved within the existing 40,000 KRW total daily budget and August 2 end date.
- 유지 변수: campaign, ad_set, audience, region, destination, daily_budget, price, schedule, location, application_form, refund_policy

### E-013 · 상세 페이지 결과물·강사 신뢰 흐름

- 준비 상태: `preview_waiting_for_e010`
- 단일 변경: 운영 페이지의 사례와 B2B 이력을 유지하면서 대표 최종 결과물을 과정 초반에 선명하게 제시하고, 주차별 결과물 갤러리 직후에 담당 강사의 과정 연관 경력을 연결
- 실행 순서: E-010 판정 이후에만 검토
- 현재 판정: **대기**
- 유지 변수: ad_campaign, ad_creative, ad_audience, ad_budget, application_form, price, schedule, location, refund_policy, campaign_apply_links, ga4_events

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
