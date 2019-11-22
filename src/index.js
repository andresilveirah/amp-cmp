import { MMS_DOMAIN, MSG_SCRIPT_URL, CMP_ORIGIN } from './constants';
import SourcePointClient from './sourcepoint_client';
import AMPClient from './amp_client';

console.info("== Loading AMP Client v1 ==");
console.debug("config from AMP: " + window.name);

var stagingVarsUrl = function(env, mmsDomain) {
  mmsDomain = mmsDomain || MMS_DOMAIN;
  return mmsDomain + "/mms/qa_set_env?env="+env;
};

var loadMessageScript = function(scriptSource) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scriptSource || MSG_SCRIPT_URL;
  document.head.appendChild(script);
};

var setEnv = function(env, onReadyCallback) {
  var request = new XMLHttpRequest();
  request.open("GET", stagingVarsUrl(env));
  request.withCredentials = true;
  request.addEventListener("load", function () { onReadyCallback(); });
  request.send();
};

var loadMessage = function(env) {
  setEnv(env, loadMessageScript);
};

var siteHref = function(siteName) {
  return "https://"+siteName;
};

var amp = new AMPClient(JSON.parse(window.name));
var clientConfig = amp.config.clientConfig;

// set query params for triggering the message or the PM directly
if (history && history.pushState) {
  var newurl = location.protocol + "//" + location.host + location.pathname
    + '?_sp_showPM='+amp.userTriggered()
    + '&_sp_runMessaging='+!amp.userTriggered();
  history.pushState({ path: newurl }, '', newurl);
}

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
    events: SourcePointClient(amp)
  }
};

loadMessage(clientConfig.stageCampaign ? "stage" : "public");
