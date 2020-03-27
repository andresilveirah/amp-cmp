var loggedFunction = function(name, callback) {
  return function() {
    console.log("["+name+"] arguments: "+JSON.stringify(arguments));
    callback.apply(null, Array.prototype.slice.call(arguments));
  };
};

var ACCEPT_ALL_CHOICE_TYPE = 11;
var SHOW_PM_CHOICE_TYPE = 12;
var ACCEPT_ALL = "all";
var REJECT_ALL = "none";

export default function (amp) {
  return {
    onMessageReady: loggedFunction('onMessageReady', function() {
      amp.show();
    }),
    onMessageChoiceError: loggedFunction('onMessageChoiceError', function (error) {
      console.error(error)
      amp.reject("");
    }),
    onSPPMObjectReady: loggedFunction('onSPPMObjectReady', function() {
      if(amp.userTriggered()) {
        amp.show();
      }
    }),
    onMessageChoiceSelect: loggedFunction('onMessageChoiceSelect', function (_choiceId, choiceType) {
      switch(choiceType) {
        case SHOW_PM_CHOICE_TYPE:
          amp.fullscreen();
          break;
        case ACCEPT_ALL_CHOICE_TYPE:
          amp.purposeConsent = ACCEPT_ALL;
          break;
        default:
          amp.purposeConsent = REJECT_ALL
      }
    }),
    onPrivacyManagerAction: loggedFunction('onPrivacyManagerAction', function (consents) {
      // consents: {"purposeConsent":"all|some|none", "vendorConsent":"all|some|none" }
      amp.purposeConsent = consents.purposeConsent
    }),
    onPMCancel: loggedFunction('onPMCancel', function () {
      if(amp.userTriggered()) amp.dismiss();
    }),
    onConsentReady:  loggedFunction('onConsentReady', function (_consentUUID, euconsent) {
      amp.purposeConsent === ACCEPT_ALL ?
        amp.accept(euconsent) :
        amp.reject(euconsent);
    })
  };
};
