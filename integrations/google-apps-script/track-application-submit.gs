const GA4_MEASUREMENT_ID = 'G-6W058PFM90';

function trackApplicationSubmit(e) {
  const apiSecret = PropertiesService.getScriptProperties().getProperty('GA4_API_SECRET');
  if (!apiSecret) {
    throw new Error('GA4_API_SECRET script property is not configured.');
  }

  const namedValues = (e && e.namedValues) || {};
  const courseAnswer = String(namedValues['신청 강좌'] || '');
  const hasNotebookLM = courseAnswer.indexOf('NotebookLM') !== -1;
  const hasRoblox = courseAnswer.indexOf('로블록스') !== -1;
  const courseSelection = hasNotebookLM && hasRoblox
    ? 'both'
    : hasNotebookLM
      ? 'notebooklm'
      : hasRoblox
        ? 'roblox'
        : 'unknown';

  const attributionRaw = String(namedValues['유입 정보 (자동 입력)'] || '');
  const attribution = parseAttribution(attributionRaw);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const campaignPrice = Number(attribution.campaign_price || 0);

  const payload = {
    client_id: 'google.forms.' + nowSeconds + '.' + Math.floor(Math.random() * 1000000),
    non_personalized_ads: true,
    events: [{
      name: 'application_submit',
      params: {
        engagement_time_msec: 1,
        session_id: nowSeconds,
        source_system: 'google_forms',
        campaign_name: attribution.utm_campaign || 'dalnayou_2026_08',
        course_selection: courseSelection,
        link_position: attribution.link_position || 'unknown',
        utm_source: attribution.utm_source || 'direct',
        utm_medium: attribution.utm_medium || 'none',
        utm_campaign: attribution.utm_campaign || 'dalnayou_2026_08',
        utm_content: attribution.utm_content || 'unspecified',
        landing_path: attribution.landing_path || 'google_forms',
        campaign_phase: attribution.campaign_phase || 'unknown',
        campaign_price: campaignPrice
      }
    }]
  };

  const response = UrlFetchApp.fetch(
    'https://www.google-analytics.com/mp/collect?measurement_id=' +
      encodeURIComponent(GA4_MEASUREMENT_ID) +
      '&api_secret=' + encodeURIComponent(apiSecret),
    {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    },
  );

  const status = response.getResponseCode();
  if (status < 200 || status >= 300) {
    throw new Error('GA4 Measurement Protocol failed with HTTP ' + status);
  }
}

function parseAttribution(rawValue) {
  const allowed = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'landing_path',
    'campaign_phase',
    'campaign_price',
    'link_position'
  ];
  const parsed = {};
  const params = new URLSearchParams(String(rawValue || ''));
  allowed.forEach(function(key) {
    const value = params.get(key);
    if (value) parsed[key] = String(value).trim().slice(0, 100);
  });
  return parsed;
}
