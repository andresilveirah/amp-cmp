(function(funcName, baseObj) {
  "use strict";
  funcName = funcName || "AMPClient";
  baseObj = baseObj || window;

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
  baseObj[funcName] = AMPClient;
  baseObj["amp"] = new AMPClient(JSON.parse(window.name));
})("AMPClient", window);
