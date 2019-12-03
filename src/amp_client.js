function AMPClient (config, onAMPMessage) {
  this._config = config;
  this._onAMPMessage = onAMPMessage;
  this._config.fullscreen = config.clientConfig &&
    config.clientConfig.fullscreen === false ?
      false :
      true;
}
AMPClient.prototype.userTriggered = function () {
  return this._config.promptTrigger === 'action';
};
AMPClient.prototype.isFullScreen = function () {
  return this._config.fullscreen;
};
AMPClient.prototype._postMessage = function (type, action, info) {
  console.info('postMessage: '+type+', '+action+' '+ (info ? JSON.stringify(info) : ''));
  var payload = {
    type: type,
    action: action
  };
  if(info !== undefined) payload.info = info;
  this._onAMPMessage(payload);
};
AMPClient.prototype._action = function (actionName, info) {
  var self = this;
  setTimeout(function () {
    self._postMessage('consent-response', actionName, info);
  }, 100);
};
AMPClient.prototype._ui = function name(uiAction) {
  this._postMessage('consent-ui', uiAction);
};
AMPClient.prototype.accept = function (consentString) {
  this._action('accept', consentString);
};
AMPClient.prototype.reject = function (consentString) {
  this._action('reject', consentString);
};
AMPClient.prototype.dismiss = function () {
  this._action('dismiss');
};
AMPClient.prototype._ready = function () {
  this._ui('ready');
};
AMPClient.prototype._fullscreen = function () {
  var self = this;
  setTimeout(function () {
    self._ui('enter-fullscreen');
  }, 200);
};
AMPClient.prototype.show = function () {
  this._ready();
  if(this.isFullScreen()){
    this._fullscreen();
  }
};

export default AMPClient;
