import { MMS_DOMAIN, MSG_SCRIPT_URL, CCPA_ORIGIN, CCPA_MMS_DOMAIN, WRAPPER_API_ORIGIN } from './constants';
import {gdpr_events, ccpa_events} from './sourcepoint_client';
import AMPClient from './amp_client';

// start index.js
console.info("== Loading AMP Client v1 ==");
console.debug("config from AMP: " + window.name);

const urlParams = new URLSearchParams(window.location.search);
const authId = urlParams.get('authId');
const clientId = urlParams.get('client_id');
const pageviewId = urlParams.get('page_view_id');
const pageviewId64 = urlParams.get('page_view_id_64');

var loadMessageScript = function() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = MSG_SCRIPT_URL;
  document.head.appendChild(script);
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

  if (amp.userTriggered() && ( clientConfig.privacyManagerId && (clientConfig.privacyManagerId.length > 0 || clientConfig.privacyManagerId > 0) )) showPM = true;
  if (!amp.userTriggered() || !clientConfig.privacyManagerId || clientConfig.privacyManagerId.length == 0) runMessaging = true;

  var newurl = location.protocol + "//" + location.host + location.pathname
    + '?_sp_showPM='+showPM
    + '&_sp_runMessaging='+runMessaging
    + '&isCCPA='+(clientConfig.isCCPA || false)
    + '&isTCFV2='+(clientConfig.isTCFV2 || false);
  history.pushState({ path: newurl }, '', newurl);
}

window._sp_ccpa = window._sp_;
if (!clientConfig.isCCPA) {
  const { 
    accountId, 
    consentLanguage, 
    env,
    mmsDomain, 
    propertyHref, 
    pmTab, 
    privacyManagerId, 
    stageCampaign, 
    targetingParams,
    wrapperAPIOrigin 
  } = clientConfig;

  window._sp_ = {
    config: {
      accountId: accountId,
      propertyHref: propertyHref,
      pmTab: pmTab,
      privacyManagerId: privacyManagerId,
      consentLanguage: consentLanguage,
      mmsDomain: mmsDomain || MMS_DOMAIN,
      wrapperAPIOrigin: wrapperAPIOrigin || WRAPPER_API_ORIGIN,
      campaignEnv: stageCampaign ? "stage" : "prod",
      env: env || "prod",
      targetingParams: targetingParams || {},
      promptTrigger: ampConfig.promptTrigger,
      events: gdpr_events(amp),
      gdpr: {}
    }
  };
  if (authId)       window._sp_.config.authId = authId;
  if (clientId)     window._sp_.config.clientId = clientId;
  if (pageviewId)   window._sp_.config.pageviewId = pageviewId;
  if (pageviewId64) window._sp_.config.pageviewId64 = pageviewId64;

  loadMessageScript();
} else {
  console.log("run ccpa");
  window._sp_ccpa = {
    config: {
      mmsDomain: clientConfig.mmsDomain || CCPA_MMS_DOMAIN,
      ccpaOrigin: clientConfig.ccpaOrigin || CCPA_ORIGIN,
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
  if (authId)       window._sp_ccpa.config.authId = authId;
  if (clientId)     window._sp_ccpa.config.clientId = clientId;
  if (pageviewId)   window._sp_ccpa.config.pageviewId = pageviewId;
  if (pageviewId64) window._sp_ccpa.config.pageviewId64 = pageviewId64;
  window._sp_ =     window._sp_ccpa;
}
// end index.js
