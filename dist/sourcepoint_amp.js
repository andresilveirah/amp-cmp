(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  var constants = {
    MMS_DOMAIN: 'https://mms.sp-prod.net',
    CMP_ORIGIN: 'https://sourcepoint.mgr.consensu.org',
    MSG_SCRIPT_URL: 'https://dialogue.sp-prod.net/messagingWithoutDetection.js'
  };
  var MMS_DOMAIN = constants.MMS_DOMAIN;
  var CMP_ORIGIN = constants.CMP_ORIGIN;
  var MSG_SCRIPT_URL = constants.MSG_SCRIPT_URL;

  var loggedFunction = function(name, callback) {
    return function() {
      console.log("["+name+"] arguments: "+JSON.stringify(arguments));
      callback(arguments);
    };
  };

  function SourcePointClient (amp) {
    var purposeConsent = "none";
    return {
      onMessageReady: loggedFunction('onMessageReady', function() {
        amp.show();
      }),
      onMessageChoiceError: loggedFunction('onMessageChoiceError', function (_error) {
        amp.dismiss();
      }),
      onSPPMObjectReady: loggedFunction('onSPPMObjectReady', function() {
        if(amp.userTriggered()) {
          amp.show();
        }
      }),
      onPrivacyManagerAction: loggedFunction('onPrivacyManagerAction', function (consents) {
        // consents: {"purposeConsent":"all|some|none", "vendorConsent":"all|some|none" }
        purposeConsent = consents.purposeConsent;
      }),
      onPMCancel: loggedFunction('onPMCancel', function () {
        if(amp.userTriggered()) amp.dismiss();
      }),
      onConsentReady:  loggedFunction('onConsentReady', function (_consentUUID, euconsent) {
        purposeConsent === "all" ?
          amp.accept(euconsent) :
          amp.reject(euconsent);
      })
    };
  }

  function AMPClient (config) {
    this.config = config;
  }
  AMPClient.prototype.userTriggered = function () {
    return this.config.promptTrigger === 'action';
  };
  AMPClient.prototype.postMessage = function(type, action, info) {
    var payload = { type: type, action: action };
    if(info !== undefined) payload.info = info;
    console.log('postMessage: '+type+', '+action+' '+ (info ? JSON.stringify(info) : ''));
    window.parent.postMessage(payload, '*');
  };
  AMPClient.prototype.action = function (actionName, info) {
    var self = this;
    setTimeout(function () { self.postMessage('consent-response', actionName, info); }, 100);
  };
  AMPClient.prototype.ui = function name(uiAction) {
    this.postMessage('consent-ui', uiAction);
  };
  AMPClient.prototype.accept = function(consentString) {
    this.action('accept', consentString);
  };
  AMPClient.prototype.reject = function(consentString) {
    this.action('reject', consentString);
  };
  AMPClient.prototype.dismiss = function() {
    this.action('dismiss');
  };
  AMPClient.prototype.ready = function () {
    this.ui('ready');
  };
  AMPClient.prototype.fullscreen = function () {
    var self = this;
    setTimeout(() => { self.ui('enter-fullscreen'); }, 100);
  };
  AMPClient.prototype.show = function () {
    this.ready();
    this.fullscreen();
  };

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
      events: SourcePointClient(amp, clientConfig.siteId, clientConfig.privacyManagerId)
    }
  };

  loadMessage(clientConfig.stageCampaign ? "stage" : "public");

})));
