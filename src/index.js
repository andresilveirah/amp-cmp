import { MSG_SCRIPT_URL, BASE_ENDPOINT } from './constants';
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

// TODO - I think we can remove these
if (history && history.pushState) {
  var newurl = location.protocol + "//" + location.host + location.pathname
    + '?_sp_showPM='+showPM
    + '&_sp_runMessaging='+runMessaging
    + '&isCCPA='+(clientConfig.isCCPA || false);
  history.pushState({ path: newurl }, '', newurl);
}

const { 
  accountId, 
  baseEndpoint,
  consentLanguage, 
  env,
  mmsDomain,  
  pmTab, 
  privacyManagerId, 
  stageCampaign, 
  targetingParams,
  wrapperAPIOrigin 
} = clientConfig;

let {
  campaignEnv,
  propertyHref
} = clientConfig;

// prefer new config type, support legacy
campaignEnv = campaignEnv || (stageCampaign ? "stage" : "prod")
if (!propertyHref && clientConfig.siteHref) {
  propertyHref = clientConfig.siteHref
}
// TODO - create baseEndpoint from old configs? or use existing ones as overrides?

// create config
const spConfig = {
  accountId: accountId,
  baseEndpoint: baseEndpoint || BASE_ENDPOINT,
  propertyHref: propertyHref,
  consentLanguage: consentLanguage,
  campaignEnv,
  env: env || "prod",
  targetingParams: targetingParams || {},
  promptTrigger: ampConfig.promptTrigger,
  runMessaging: !showPM
}

if (authId)       spConfig.authId = authId;
if (clientId)     spConfig.clientId = clientId;
if (pageviewId)   spConfig.pageviewId = pageviewId;
if (pageviewId64) spConfig.pageviewId64 = pageviewId64;
if (wrapperAPIOrigin) spConfig.wrapperAPIOrigin = wrapperAPIOrigin;
if (mmsDomain) spConfig.mmsDomain = mmsDomain

if (clientConfig.isCCPA) {
  spConfig.ccpa = {}
  spConfig.events = ccpa_events(amp)
} else {
  spConfig.gdpr = {
    includeTcfApi: false
  }
  spConfig.events = gdpr_events(amp)
}

window._sp_ = {
  config: spConfig
};

loadMessageScript((_sp_) => {
  if (showPM) {
    if (clientConfig.isCCPA) {
      _sp_.ccpa.loadPrivacyManagerModal(privacyManagerId, pmTab)
    } else {
      _sp_.gdpr.loadPrivacyManagerModal(privacyManagerId, pmTab)
    }
  }
});

// end index.js
