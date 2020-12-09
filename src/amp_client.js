// start amp_client.js
function AMPClient (config, onAMPMessage) {
  this._config = config;
  this._onAMPMessage = onAMPMessage;
}
AMPClient.prototype.userTriggered = function () {
  return this._config.promptTrigger === 'action';
};
AMPClient.prototype._postMessage = function (type, action, info, consentMetadata) {
  console.info(`-- AMP Posting Message -- type: ${type}, action: ${action}${info ? `, info: ${JSON.stringify(info)}` : ''}${consentMetadata ? `, consentMetaData: ${JSON.stringify(consentMetadata)}` : ''}`);
  var payload = {
    type: type,
    action: action,
    initialHeight: '60vh',
    enableBorder: false
  };
  if (info !== undefined) payload.info = info;
  if (action === 'accept'  || action === 'reject') {
    payload.consentMetadata = consentMetadata;
  }
  this._onAMPMessage(payload);
};
AMPClient.prototype._action = function (actionName, info, consentMetadata) {
  setTimeout(() => {
    this._postMessage('consent-response', actionName, info, consentMetadata);
  }, 100);
};
AMPClient.prototype._ui = function name(uiAction) {
  this._postMessage('consent-ui', uiAction);
};
AMPClient.prototype.accept = function (consentString, consentMetadata) {
  this._action('accept', consentString, consentMetadata);
};
AMPClient.prototype.reject = function (consentString, consentMetadata) {
  this._action('reject', consentString, consentMetadata);
};
AMPClient.prototype.dismiss = function () {
  this._action('dismiss');
};
AMPClient.prototype._ready = function () {
  this._ui('ready');
};
AMPClient.prototype.fullscreen = function () {
  this._ui('enter-fullscreen');
};
AMPClient.prototype.show = function () {
  this._ready();
};

export default AMPClient;
// end amp_client.js
