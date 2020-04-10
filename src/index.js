import { MMS_DOMAIN, MSG_SCRIPT_URL, CMP_ORIGIN, CCPA_ORIGIN, CCPA_MMS_DOMAIN } from './constants';
import { gdpr_events, ccpa_events } from './sourcepoint_client';
import AMPClient from './amp_client';

// start index.js
console.info("== Loading AMP Client v1 ==");
console.debug("config from AMP: " + window.name);

var stagingVarsUrl = function(mmsDomain) {
  mmsDomain = mmsDomain || MMS_DOMAIN;
  return mmsDomain + "/mms/qa_set_env?env=stage";
};

var loadMessageScript = function() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = MSG_SCRIPT_URL;
  document.head.appendChild(script);
};

var setStage = function(onReadyCallback) {
  var request = new XMLHttpRequest();
  request.withCredentials = true;
  request.open("GET", stagingVarsUrl());
  request.addEventListener("load", onReadyCallback);
  request.send();
};

var loadMessage = function(isStageCampaign) {
  isStageCampaign ?
    setStage(loadMessageScript) :
    loadMessageScript();
};

var siteHref = function(siteName) {
  return "https://"+siteName;
};

var onAMPMessage = function(payload) {
  window.parent.postMessage(payload, '*')
}
var ampConfig = JSON.parse(window.name)
var amp = new AMPClient(ampConfig, onAMPMessage);
var clientConfig = ampConfig.clientConfig;

// set query params for triggering the message or the PM directly
if (history && history.pushState) {
  let showPM = false;
  let runMessaging = false;
  if (amp.userTriggered() && ( clientConfig.privacyManagerId && clientConfig.privacyManagerId.length > 0)) showPM = true;
  if (!amp.userTriggered() || !clientConfig.privacyManagerId || clientConfig.privacyManagerId.length == 0) runMessaging = true;

  var newurl = location.protocol + "//" + location.host + location.pathname
    + '?_sp_showPM='+showPM
    + '&_sp_runMessaging='+runMessaging
    + '&isCCPA='+(clientConfig.isCCPA || false);
  history.pushState({ path: newurl }, '', newurl);
}

window._sp_ccpa = window._sp_;

if (!clientConfig.isCCPA) {
  console.log("run gdpr");
  window._sp_ = {
    config: {
      accountId: clientConfig.accountId,
      siteId: clientConfig.siteId,
      privacyManagerId: clientConfig.privacyManagerId,
      siteHref: siteHref(clientConfig.siteName),
      mmsDomain: MMS_DOMAIN,
      cmpOrigin: CMP_ORIGIN,
      waitForConsent: true,
      targetingParams: clientConfig.targetingParams || {},
      events: gdpr_events(amp),
    }
  };
  loadMessage(clientConfig.stageCampaign);
} else {
  console.log("run ccpa");
  window._sp_ccpa = {
    config: {
      mmsDomain: CCPA_MMS_DOMAIN,
      ccpaOrigin: CCPA_ORIGIN,
      accountId: clientConfig.accountId,
      getDnsMsgMms: clientConfig.getDnsMsgMms,
      alwaysDisplayDns: clientConfig.alwaysDisplayDns,
      isCCPA: true,
      siteId: clientConfig.siteId,
      siteHref: clientConfig.siteHref,
      targetingParams: clientConfig.targetingParams || {},
      privacyManagerId: clientConfig.privacyManagerId,
      events: ccpa_events(amp),
    }
  };
  window._sp_ = window._sp_ccpa;
}
// end index.js
