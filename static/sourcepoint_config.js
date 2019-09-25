(function(funcName, baseObj) {
  "use strict";
  funcName = funcName || "_sp_";
  baseObj = baseObj || window;

  console.log("== Loading AMP Web Page v1 ==");
  console.log("config from AMP: " + window.name);
  var clientConfig = window.amp.config.clientConfig;

  baseObj[funcName] = {
    config: {
      accountId: clientConfig.accountId,
      siteHref: "https://"+clientConfig.siteName,
      mmsDomain: window._SP_CONSTANTS.MMS_DOMAIN,
      cmpOrigin: window._SP_CONSTANTS.CMP_ORIGIN,
      waitForConsent: true,
      targetingParams: clientConfig.targetingParams || {},
      events: window.SourcePointClient(amp, clientConfig.siteId, clientConfig.privacyManagerId)
    }
  }
})("_sp_", window);
