(function (window, document) {
  "use strict";

  var PIXEL_ID = "2173864043186723";

  if (!window.fbq) {
    var fbq = function () {
      fbq.callMethod
        ? fbq.callMethod.apply(fbq, arguments)
        : fbq.queue.push(arguments);
    };

    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    var firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");

  function getCourse() {
    if (window.location.pathname.indexOf("notebooklm") !== -1) return "notebooklm";
    if (window.location.pathname.indexOf("roblox") !== -1) return "roblox";
    return "course_selector";
  }

  function getCampaign() {
    if (!window.DalnayouCampaign) return {};
    var phase = window.DalnayouCampaign.getPhase();
    return {
      campaign_phase: phase.id,
      campaign_price: phase.price,
      currency: "KRW",
    };
  }

  function buildParams(target) {
    var params = getCampaign();
    params.content_name = getCourse();
    params.event_label = target.getAttribute("data-track-label") || "";
    return params;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var course = getCourse();
    if (course !== "course_selector") {
      window.fbq("track", "ViewContent", {
        content_name: course,
        content_category: "course",
      });
    }

    document.addEventListener(
      "click",
      function (event) {
        if (!(event.target instanceof Element)) return;
        var target = event.target.closest("[data-track-event]");
        if (!target) return;

        var eventName = target.getAttribute("data-track-event");
        var params = buildParams(target);

        if (eventName === "apply_click") {
          window.fbq("trackCustom", "ApplyClick", params);
        } else if (eventName === "contact_click") {
          window.fbq("track", "Contact", params);
        } else if (eventName === "course_click") {
          params.content_name =
            target.getAttribute("data-track-label") === "main_split_notebooklm"
              ? "notebooklm"
              : "roblox";
          window.fbq("trackCustom", "CourseSelect", params);
        } else if (eventName === "map_click") {
          window.fbq("trackCustom", "MapClick", params);
        } else if (eventName === "print_click") {
          window.fbq("trackCustom", "PrintPoster", params);
        }
      },
      true
    );
  });
})(window, document);
