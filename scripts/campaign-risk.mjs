const finiteValues = (values) => values.filter(Number.isFinite);

const campaignDeadline = (state) => {
  const explicit = state.campaign?.schedule_end_time?.current_at;
  if (explicit) return new Date(explicit);
  if (state.campaign?.end_date) {
    return new Date(`${state.campaign.end_date}T23:59:00+09:00`);
  }
  return null;
};

export const calculateCampaignRisk = (state, experiments, now = new Date()) => {
  const courses = Object.values(state.courses ?? {});
  const paidTargets = finiteValues(courses.map((course) => course.paid_target));
  const targetTotal = paidTargets.reduce((sum, value) => sum + value, 0);
  const paidConfirmedTotal =
    state.applications?.paid_confirmed_total_reported_by_user;
  const paidGap = Number.isFinite(paidConfirmedTotal)
    ? Math.max(0, targetTotal - paidConfirmedTotal)
    : null;
  const paidProgressPercent =
    Number.isFinite(paidConfirmedTotal) && targetTotal > 0
      ? Number(((paidConfirmedTotal / targetTotal) * 100).toFixed(1))
      : null;

  const deadline = campaignDeadline(state);
  const hoursRemaining =
    deadline && !Number.isNaN(deadline.getTime())
      ? Math.max(0, (deadline.getTime() - now.getTime()) / 3_600_000)
      : null;
  const daysRemaining = Number.isFinite(hoursRemaining)
    ? hoursRemaining / 24
    : null;
  const requiredPaidPerDay =
    Number.isFinite(paidGap) && Number.isFinite(daysRemaining) && daysRemaining > 0
      ? paidGap / daysRemaining
      : null;

  const coursePaidCountsKnown = courses.every((course) =>
    Number.isFinite(course.paid_confirmed),
  );
  const courseTargetsMet =
    coursePaidCountsKnown &&
    courses.every(
      (course) => course.paid_confirmed >= course.paid_target,
    );

  const funnelCourses = Object.values(state.ga4_paid_cta_funnel ?? {}).filter(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      Number.isFinite(entry.apply_cta_views) &&
      Number.isFinite(entry.apply_clicks),
  );
  const paidCtaViews = funnelCourses.reduce(
    (sum, entry) => sum + entry.apply_cta_views,
    0,
  );
  const paidApplyClicks = funnelCourses.reduce(
    (sum, entry) => sum + entry.apply_clicks,
    0,
  );
  const paidViewToClickPercent =
    paidCtaViews > 0
      ? Number(((paidApplyClicks / paidCtaViews) * 100).toFixed(2))
      : null;

  const e010 = experiments?.experiments?.find(
    (experiment) => experiment.id === "E-010",
  );
  const qualifiedApplyClicks = courses.reduce(
    (sum, course) =>
      sum +
      (Number.isFinite(course.qualified_apply_clicks)
        ? course.qualified_apply_clicks
        : 0),
    0,
  );
  const e010QualifiedBaseline =
    e010?.post_change_baseline?.qualified_non_us_paid_course_clicks ?? 0;
  const e010QualifiedDelta = Math.max(
    0,
    qualifiedApplyClicks - e010QualifiedBaseline,
  );
  const e010Minimum =
    e010?.evaluation_gate?.minimum_additional_qualified_apply_clicks ?? null;
  const formResponses = state.applications?.google_form_total;
  const formResponseBaseline = e010?.post_change_baseline?.google_form_responses;
  const formResponseDelta =
    Number.isFinite(formResponses) && Number.isFinite(formResponseBaseline)
      ? Math.max(0, formResponses - formResponseBaseline)
      : null;

  let status = "unknown";
  if (courseTargetsMet) {
    status = "goal_met";
  } else if (Number.isFinite(hoursRemaining) && hoursRemaining <= 0) {
    status = "deadline_passed";
  } else if (
    Number.isFinite(hoursRemaining) &&
    hoursRemaining <= 168 &&
    Number.isFinite(paidGap) &&
    targetTotal > 0 &&
    paidGap / targetTotal >= 0.5
  ) {
    status = "critical";
  } else if (Number.isFinite(paidGap) && paidGap > 0) {
    status = "high";
  }

  const reasons = [];
  if (Number.isFinite(paidGap) && paidGap > 0) {
    reasons.push(`전체 입금 목표까지 ${paidGap}명이 더 필요함`);
  }
  if (!coursePaidCountsKnown) {
    reasons.push("과정별 입금 집계가 없어 과정별 6명 달성 여부를 확인할 수 없음");
  }
  if (Number.isFinite(formResponseDelta) && formResponseDelta === 0) {
    reasons.push("E-010 적용 후 신규 Google Form 응답이 없음");
  }
  if (
    Number.isFinite(e010Minimum) &&
    e010QualifiedDelta < e010Minimum
  ) {
    reasons.push(
      `E-010 변경 후 검증된 신청 이동이 ${e010QualifiedDelta}/${e010Minimum}회로 판정 표본 미달`,
    );
  }

  return {
    status,
    evaluated_at: now.toISOString(),
    deadline_at: deadline?.toISOString() ?? null,
    hours_remaining: Number.isFinite(hoursRemaining)
      ? Number(hoursRemaining.toFixed(1))
      : null,
    days_remaining: Number.isFinite(daysRemaining)
      ? Number(daysRemaining.toFixed(2))
      : null,
    target_paid_total: targetTotal,
    paid_confirmed_total: Number.isFinite(paidConfirmedTotal)
      ? paidConfirmedTotal
      : null,
    paid_gap_total: paidGap,
    paid_progress_percent: paidProgressPercent,
    required_paid_per_day: Number.isFinite(requiredPaidPerDay)
      ? Number(requiredPaidPerDay.toFixed(2))
      : null,
    course_paid_counts_known: coursePaidCountsKnown,
    course_targets_met: courseTargetsMet,
    same_system_ga4_paid_funnel: {
      apply_cta_views: paidCtaViews || null,
      apply_clicks: paidApplyClicks || null,
      view_to_click_percent: paidViewToClickPercent,
      note: "GA4 paid-traffic metrics only. Meta landing views are not mixed into this rate.",
    },
    e010: {
      status: e010?.status ?? null,
      additional_qualified_apply_clicks: e010QualifiedDelta,
      required_additional_qualified_apply_clicks: e010Minimum,
      google_form_response_delta: formResponseDelta,
    },
    reasons,
  };
};
