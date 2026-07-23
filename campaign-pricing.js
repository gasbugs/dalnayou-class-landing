(() => {
  "use strict";

  const WON = new Intl.NumberFormat("ko-KR");
  const NORMAL_PRICE = 249000;
  const KAKAO_URL = "http://pf.kakao.com/_xeKJxen/chat";
  const APPLICATION_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdS8kivBEPbVNBuH6hbRzIdjuMw4JosEhD3l-82A85eFRULJQ/viewform";
  const ATTRIBUTION_ENTRY = "entry.1074868867";

  const phases = [
    {
      id: "earlybird_1",
      label: "1차 얼리버드",
      price: 189000,
      startsAt: "2026-07-04T00:00:00+09:00",
      endsAt: "2026-08-02T00:00:00+09:00",
      deadline: "8/1(토) 자정 전",
      status: "8/1(토)까지 선착순 1차 얼리버드 혜택이 적용됩니다.",
    },
    {
      id: "earlybird_2",
      label: "2차 얼리버드",
      price: 199000,
      startsAt: "2026-08-02T00:00:00+09:00",
      endsAt: "2026-08-09T00:00:00+09:00",
      deadline: "8/8(토) 자정 전",
      status: "8/2(일)부터 7일간 선착순 2차 얼리버드 혜택이 적용됩니다.",
    },
    {
      id: "final",
      label: "파이널 등록",
      price: 209000,
      startsAt: "2026-08-09T00:00:00+09:00",
      endsAt: "2026-08-16T00:00:00+09:00",
      deadline: "8/15(토) 자정 전",
      status: "개강 전 파이널 등록 기간입니다. 잔여석 마감 시 조기 종료됩니다.",
    },
  ].map((phase) => ({
    ...phase,
    startMs: new Date(phase.startsAt).getTime(),
    endMs: new Date(phase.endsAt).getTime(),
  }));

  const closedPhase = {
    id: "closed",
    label: "개강 상담",
    price: 209000,
    startMs: phases.at(-1).endMs,
    endMs: phases.at(-1).endMs,
    deadline: "모집 종료",
    status: "정규 모집이 종료되었습니다. 추가 등록 가능 여부는 카카오톡으로 문의해주세요.",
  };

  const formatPrice = (value) => `${WON.format(value)}원`;
  const getPhase = (now = Date.now()) =>
    phases.find((phase) => now < phase.endMs) || closedPhase;

  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  const buildApplicationUrl = (phase) => {
    const source = window.dalnayouSource || {};
    const course = window.location.pathname.includes("roblox")
      ? "roblox"
      : window.location.pathname.includes("notebooklm")
        ? "notebooklm"
        : "unspecified";
    const attribution = new URLSearchParams({
      utm_source: source.utm_source || source.source || source.src || "direct",
      utm_medium: source.utm_medium || "none",
      utm_campaign: source.utm_campaign || source.campaign || "dalnayou_2026_08",
      utm_content: source.utm_content || "unspecified",
      landing_path: source.landing_path || window.location.pathname,
      campaign_phase: phase.id,
      campaign_price: String(phase.price),
      course,
    });
    const url = new URL(APPLICATION_FORM_URL);
    url.searchParams.set("usp", "pp_url");
    url.searchParams.set(ATTRIBUTION_ENTRY, attribution.toString());
    return url.toString();
  };

  const renderPricing = (phase) => {
    const discount = NORMAL_PRICE - phase.price;
    const discountRate = Math.round((discount / NORMAL_PRICE) * 100);
    const priceText = formatPrice(phase.price);
    const discountText = `${WON.format(discount / 10000)}만원 할인 · 약 ${discountRate}% OFF`;

    setText("[data-campaign-label]", phase.label);
    setText("[data-campaign-price]", priceText);
    setText("[data-campaign-deadline]", phase.deadline);
    setText("[data-campaign-status]", phase.status);
    setText("[data-campaign-discount]", discountText);
    setText(
      "[data-campaign-mobile-summary]",
      phase.id === "closed"
        ? "정규 모집 종료 · 추가 등록 가능 여부 문의"
        : `${phase.deadline} ${priceText} · 잔여석 마감 임박`,
    );
    setText(
      "[data-campaign-countdown-title]",
      phase.id === "closed" ? "추가 등록 가능 여부를 확인해주세요" : `${priceText} 혜택 마감까지`,
    );
    setText(
      "[data-campaign-kicker]",
      phase.id === "closed"
        ? "정규 모집 종료 · 개강 상담"
        : `잔여석 마감 임박 · ${phase.label} 종료 카운트다운`,
    );

    document.querySelectorAll("[data-campaign-phase]").forEach((element) => {
      element.dataset.campaignPhase = phase.id;
    });

    document.querySelectorAll("[data-campaign-apply]").forEach((link) => {
      if (phase.id === "closed") {
        link.href = KAKAO_URL;
        link.textContent = "추가 등록 문의";
        link.dataset.trackEvent = "contact_click";
        link.dataset.trackLabel = `${link.dataset.trackLabel || "apply"}_after_close`;
        return;
      }
      link.href = buildApplicationUrl(phase);
    });
  };

  const initCountdown = (root, initialPhase) => {
    const days = root.querySelector("[data-countdown-days]");
    const hours = root.querySelector("[data-countdown-hours]");
    const minutes = root.querySelector("[data-countdown-minutes]");
    const seconds = root.querySelector("[data-countdown-seconds]");
    const panel = root.closest("[data-campaign-panel]") || root.parentElement;
    const progress = panel?.querySelector("[data-countdown-progress]");
    const pad = (value) => String(value).padStart(2, "0");
    let phaseId = initialPhase.id;

    const updateUnit = (element, value) => {
      if (!element || element.textContent === value) return;
      element.textContent = value;
      element.classList.remove("is-ticking");
      void element.offsetWidth;
      element.classList.add("is-ticking");
      window.setTimeout(() => element.classList.remove("is-ticking"), 170);
    };

    const render = () => {
      const phase = getPhase();
      if (phase.id !== phaseId) {
        phaseId = phase.id;
        renderPricing(phase);
      }

      const remaining = Math.max(0, phase.endMs - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      updateUnit(days, pad(Math.floor(totalSeconds / 86400)));
      updateUnit(hours, pad(Math.floor((totalSeconds % 86400) / 3600)));
      updateUnit(minutes, pad(Math.floor((totalSeconds % 3600) / 60)));
      updateUnit(seconds, pad(totalSeconds % 60));

      if (progress) {
        const duration = Math.max(1, phase.endMs - phase.startMs);
        const ratio = phase.id === "closed" ? 0 : Math.max(0, Math.min(1, remaining / duration));
        progress.style.transform = `scaleX(${ratio})`;
        progress.parentElement?.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
      }
    };

    render();
    window.setInterval(render, 1000);
  };

  const init = () => {
    const phase = getPhase();
    renderPricing(phase);
    document.querySelectorAll("[data-countdown]").forEach((root) => initCountdown(root, phase));

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "campaign_phase_view",
      campaign_phase: phase.id,
      campaign_price: phase.price,
    });
  };

  window.DalnayouCampaign = {
    normalPrice: NORMAL_PRICE,
    phases,
    getPhase,
    formatPrice,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
