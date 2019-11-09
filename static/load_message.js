(function() {
  "use strict";

  console.info("== Loading AMP Client v1 ==");
  console.debug("config from AMP: " + window.name);

  var stagingVarsUrl = function(env, mmsDomain) {
    mmsDomain = mmsDomain || window._SP_CONSTANTS.MMS_DOMAIN;
    return mmsDomain + "/mms/qa_set_env?env="+env;
  };

  var loadMessageScript = function(scriptSource) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptSource || window._SP_CONSTANTS.MSG_SCRIPT_URL;
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

  var clientConfig = window.amp.config.clientConfig;

  loadMessage(clientConfig.stageCampaign ? "stage" : "public");
})();
