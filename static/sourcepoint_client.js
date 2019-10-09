(function(funcName, baseObj) {
  "use strict";
  funcName = funcName || "SourcePointClient";
  baseObj = baseObj || window;

  var SourcePointClient = function (amp, siteId, pmId) {
    var purposeConsent = "none";
    return {
      onMessageReady: function () {
        console.log("onMessageReady: "+JSON.stringify(arguments));
        amp.show();
      },
      onMessageChoiceError: function (_error) {
        console.error("onMessageChoiceError: arguments: "+JSON.stringify(arguments));
        amp.dismiss();
      },
      onSPPMObjectReady: function() {
        console.log("onSPPMObjectReady: arguments: "+JSON.stringify(arguments))
        // called when loadPrivacyManagerModal is available in the _sp_ object
        if(amp.userTriggered()) {
          amp.show();
        }
      },
      onPrivacyManagerAction: function (consents) {
        // consents: {"purposeConsent":"all|some|none", "vendorConsent":"all|some|none" }
        // called when the user has taken any action within the PM
        console.log("[onPrivacyManagerAction] arguments: "+JSON.stringify(arguments));
        purposeConsent = consents.purposeConsent
      },
      onPMCancel: function () {
        // called when the user clicks on Cancel within the PM
        console.log("[onPMCancel] arguments: "+JSON.stringify(arguments));
        if(amp.userTriggered()) amp.dismiss();
      },
      onConsentReady: function (consentUUID, euconsent) {
        // called once when the user is done interacting with the message OR the PM
        console.log("[onConsentReady] consentUUID: "+consentUUID+" euconsent: "+euconsent);
        purposeConsent === "all" ?
          amp.accept(euconsent) :
          amp.reject(euconsent);
      },
    }
  }

  baseObj[funcName] = SourcePointClient;
})("SourcePointClient", window);
