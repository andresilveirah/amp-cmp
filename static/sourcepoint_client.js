(function(funcName, baseObj) {
  "use strict";
  funcName = funcName || "SourcePointClient";
  baseObj = baseObj || window;

  var SourcePointClient = function (amp, siteId, pmId) {
    var purposeConsent = "none";
    return {
      onMessageReady: function () {
        // only called if the message is going to be shown
        console.log("onMessageReady: "+JSON.stringify(arguments));

        amp.show();
      },
      onMessageChoiceSelect: function (actionId) {
        // called when an action is taken within the Message
        console.log("onMessageChoiceSelect: "+JSON.stringify(arguments));

        // TODO: check if the close message button will always have the same actionId
        if(actionId === 235561) amp.dismiss();
      },
      onMessageChoiceError: function (error) {
        console.log("onMessageChoiceError: "+JSON.stringify(arguments));
        amp.dismiss();
      },
      onSPPMObjectReady: function() {
        console.log("onSPPMObjectReady: "+JSON.stringify(arguments))
        // called when loadPrivacyManagerModal is available in the _sp_ object
        if(amp.userTriggered()) {
          amp.show();
          window.onDocumentReady(function() {
            window._sp_.loadPrivacyManagerModal(siteId, pmId);
          });
        }
      },
      onPrivacyManagerAction: function (consents) { // {"purposeConsent":"all|some|none", "vendorConsent":"all|some|none" }
        // called when the user has taken any action within the PM
        console.log("onPrivacyManagerAction: "+JSON.stringify(arguments));
        purposeConsent = consents.purposeConsent
      },
      onPMCancel: function () {
        // called when the user clicks on Cancel within the PM
        console.log("onPMCancel: "+JSON.stringify(arguments));
        if(amp.userTriggered()) amp.dismiss();
      },
      onConsentReady: function (consentUUID, euconsent) {
        // called once when the user is done interacting with the message OR the PM
        console.log("onConsentReady: "+JSON.stringify(arguments));
        purposeConsent === "all" ? amp.accept(euconsent) : amp.reject(euconsent);
      },
    }
  }

  baseObj[funcName] = SourcePointClient;
})("SourcePointClient", window);
