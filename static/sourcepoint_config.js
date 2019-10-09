(function(funcName, baseObj) {
  "use strict";
  funcName = funcName || "_sp_";
  baseObj = baseObj || window;

  var siteHref = function(siteName) {
    return "https://"+siteName;
  };

  var clientConfig = window.amp.config.clientConfig;

  // set query params for triggering the message or the PM directly
  if (history && history.pushState) {
    var newurl = location.protocol + "//" + location.host + location.pathname
      + '?_sp_showPM='+window.amp.userTriggered()
      + '&_sp_runMessaging='+!window.amp.userTriggered();
    history.pushState({ path: newurl }, '', newurl);
  }

  baseObj[funcName] = {
    config: {
      accountId: clientConfig.accountId,
      siteId: clientConfig.siteId,
      privacyManagerId: clientConfig.privacyManagerId,
      siteHref: siteHref(clientConfig.siteName),
      mmsDomain: window._SP_CONSTANTS.MMS_DOMAIN,
      cmpOrigin: window._SP_CONSTANTS.CMP_ORIGIN,
      waitForConsent: true,
      targetingParams: clientConfig.targetingParams || {},
      events: window.SourcePointClient(amp, clientConfig.siteId, clientConfig.privacyManagerId)
    }
  };
})("_sp_", window);
