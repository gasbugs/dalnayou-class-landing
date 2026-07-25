(function (window, document) {
  "use strict";

  var measurementId = "G-6W058PFM90";

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js?id=' + measurementId + '"]')) {
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(script);
  }

  window.dalnayouSendGa4 = function (eventName, params) {
    if (!eventName || typeof window.gtag !== "function") return;
    window.gtag("event", eventName, params || {});
  };
})(window, document);
