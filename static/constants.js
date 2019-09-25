(function(funcName, baseObj) {
  "use strict";
  funcName = funcName || "_SP_CONSTANTS";
  baseObj = baseObj || window;

  baseObj[funcName] = {
    MMS_DOMAIN: 'https://mms.sp-prod.net',
    CMP_ORIGIN: 'https://sourcepoint.mgr.consensu.org',
    MSG_SCRIPT_URL: 'https://dialogue.sp-prod.net/messagingWithoutDetection.js'
  };
})("_SP_CONSTANTS", window);
