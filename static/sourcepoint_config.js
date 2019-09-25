(function(funcName, baseObj) {
  "use strict";
  funcName = funcName || "_sp_";
  baseObj = baseObj || window;

  console.log("== Loading AMP Web Page v1 ==");
  console.log("config from AMP: " + window.name);

  var amp = new window.AMPClient(JSON.parse(window.name));
  var clientConfig = amp.config.clientConfig;
  baseObj[funcName] = {
    config: {
      accountId: clientConfig.accountId,
      siteHref: "https://"+clientConfig.siteName,
      mmsDomain: 'https://mms.sp-prod.net',
      cmpOrigin: "https://sourcepoint.mgr.consensu.org",
      waitForConsent: true,
      targetingParams: clientConfig.targetingParams || {},
      events: window.SourcePointClient(amp, clientConfig.siteId, clientConfig.privacyManagerId)
    }
  }
})("_sp_", window);
