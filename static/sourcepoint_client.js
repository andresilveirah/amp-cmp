(function(funcName, baseObj) {
  "use strict";
  funcName = funcName || "SourcePointClient";
  baseObj = baseObj || window;

  var loggedFunction = function(name, callback) {
    return function() {
      console.log("["+name+"] arguments: "+JSON.stringify(arguments));
      callback(arguments)
    }
  };

  var SourcePointClient = function (amp) {
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
  };

  baseObj[funcName] = SourcePointClient;
})("SourcePointClient", window);
