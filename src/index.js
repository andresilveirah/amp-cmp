import { MMS_DOMAIN, MSG_SCRIPT_URL, MSG_SCRIPT_URL_CCPA, CCPA_ORIGIN, CCPA_MMS_DOMAIN, WRAPPER_API_ORIGIN } from './constants';
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

var loadMessageScript = function(callback) {
  window._sp_queue = window._sp_queue || []
  _sp_queue.push(callback);

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = MSG_SCRIPT_URL;
  document.head.appendChild(script);
};

var loadMessageScriptCcpa = function () {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = MSG_SCRIPT_URL_CCPA;
  document.head.appendChild(script);
}

var onAMPMessage = function(payload) {
  window.parent.postMessage(payload, '*')
}
var ampConfig = JSON.parse(window.name)
var amp = new AMPClient(ampConfig, onAMPMessage);
var clientConfig = ampConfig.clientConfig;

// set query params for triggering the message or the PM directly
let showPM = false;
let runMessaging = false;

if (amp.userTriggered() && ( clientConfig.privacyManagerId && (clientConfig.privacyManagerId.length > 0 || clientConfig.privacyManagerId > 0) )) showPM = true;
if (!amp.userTriggered() || !clientConfig.privacyManagerId || clientConfig.privacyManagerId.length == 0) runMessaging = true;

if (history && history.pushState) {
  var newurl = location.protocol + "//" + location.host + location.pathname
    + '?_sp_showPM='+showPM
    + '&_sp_runMessaging='+runMessaging
    + '&isCCPA='+(clientConfig.isCCPA || false);
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
      consentLanguage: consentLanguage,
      mmsDomain: mmsDomain || MMS_DOMAIN,
      wrapperAPIOrigin: wrapperAPIOrigin || WRAPPER_API_ORIGIN,
      campaignEnv: stageCampaign ? "stage" : "prod",
      env: env || "prod",
      targetingParams: targetingParams || {},
      promptTrigger: ampConfig.promptTrigger,
      runMessaging: !showPM,
      events: gdpr_events(amp),
      gdpr: {
        includeTcfApi: false
      }
    }
  };
  if (authId)       window._sp_.config.authId = authId;
  if (clientId)     window._sp_.config.clientId = clientId;
  if (pageviewId)   window._sp_.config.pageviewId = pageviewId;
  if (pageviewId64) window._sp_.config.pageviewId64 = pageviewId64;

  loadMessageScript((_sp_) => {
    if (showPM) {
      _sp_.gdpr.loadPrivacyManagerModal(privacyManagerId, pmTab)
    }
  });
} else {
  console.log("run ccpa");
  if (!clientConfig.propertyHref && clientConfig.siteHref) {
    clientConfig.propertyHref = clientConfig.siteHref
  }

  window._sp_ccpa = {
    config: {
      mmsDomain: clientConfig.mmsDomain || CCPA_MMS_DOMAIN,
      ccpaOrigin: clientConfig.ccpaOrigin || CCPA_ORIGIN,
      accountId: clientConfig.accountId,
      getDnsMsgMms: clientConfig.getDnsMsgMms,
      alwaysDisplayDns: clientConfig.alwaysDisplayDns,
      isCCPA: true,
      siteId: clientConfig.siteId,
      siteHref: clientConfig.propertyHref,
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

  loadMessageScriptCcpa();
}
// end index.js
