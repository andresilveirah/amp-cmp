(function(funcName, baseObj) {
  "use strict";
  funcName = funcName || "_sp_";
  baseObj = baseObj || window;

  var siteHref = function(siteName) {
    return "https://"+siteName;
  }

  var clientConfig = window.amp.config.clientConfig;

  baseObj[funcName] = {
    config: {
      accountId: clientConfig.accountId,
      siteHref: siteHref(clientConfig.siteName),
      mmsDomain: window._SP_CONSTANTS.MMS_DOMAIN,
      cmpOrigin: window._SP_CONSTANTS.CMP_ORIGIN,
      waitForConsent: true,
      targetingParams: clientConfig.targetingParams || {},
      events: window.SourcePointClient(amp, clientConfig.siteId, clientConfig.privacyManagerId)
    }
  }
})("_sp_", window);
