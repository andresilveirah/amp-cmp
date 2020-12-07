// start sourcepoint_client.js
var loggedFunction = function(name, callback) {
  return function(...args) {
    console.log(`[${name}] arguments: ${JSON.stringify(args)}`);
    callback(...args);
  };
};

var ACCEPT_ALL_CHOICE_TYPE = 11;
var SHOW_PM_CHOICE_TYPE = 12;
var REJECT_ALL_CHOICE_TYPE = 13;
var ACCEPT_ALL = "all";
var REJECT_ALL = "none";
var REJECT_SOME = "some"

function gdpr_events(amp) {
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
    onPrivacyManagerActionStatus: loggedFunction('onPrivacyManagerActionStatus', function (consents) {
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

function ccpa_events(amp) {
  // consent string(uspString):
  // version|explicit_notice_shown|user_optout_of_sale
  return {
    onMessageReady: function () {
      amp.show();
    },
    onMessageChoiceSelect: function (choice_id, choiceType) {
      switch(choiceType) {
        case SHOW_PM_CHOICE_TYPE:
          amp.fullscreen();
          break;
        case ACCEPT_ALL_CHOICE_TYPE:
          amp.purposeConsent = ACCEPT_ALL;
          amp.accept('1YN-'); // The user has not opted out of the sale. Explicit notice shown.
          break;
        case REJECT_ALL_CHOICE_TYPE:
          amp.purposeConsent = REJECT_ALL;
          amp.reject('1YY-'); // The user has opted out of their data being used for the sale. Explicit notice shown.
          break;
        default:
          break;

      }
    },
    onPrivacyManagerAction: function (pmData) {
      amp.purposeConsent = pmData.purposeConsent;
    },
    onPrivacyManagerActionStatus: function (pmData) {
      amp.purposeConsent = pmData.purposeConsent;
    },
    onMessageChoiceError: function (err) {
      amp.dismiss();
    },
    onConsentReady: function (consentUUID, euconsent) {
      switch( amp.purposeConsent ) {
        case ACCEPT_ALL:
          amp.accept('1YN-'); // The user has not opted out of the sale. Explicit notice shown.
          break;
        case REJECT_ALL:
          amp.reject('1YY-'); // The user has opted out of their data being used for the sale. Explicit notice shown.
          break;
        case REJECT_SOME:
          amp.reject('1YY-'); // The user has opted out of their data being used for the sale. Explicit notice shown.
          break;
        default:
          amp.dismiss();
          break;
      }
    },
    onPMCancel: function () {
      if(amp.userTriggered()) {
        amp.dismiss();
      }
    },
    onMessageReceiveData: function (data) {
      if (data.msg_id==0) { // targeting doesnt apply for messaging to be shown
        amp.accept('1NN-'); // The user has not opted out of the sale. No explicit notice shown.
      }
      if(amp.userTriggered()) {
        amp.show();
      }
    },
    onSPPMObjectReady: function () {
      if(amp.userTriggered()) {
        amp.show();
      }
    }
  };
};

function tcfv2_events(amp) {
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
      // consents: { "all|some|none" }
      amp.purposeConsent = (consents === 'all') ? ACCEPT_ALL : 'consents'
    }),
    onPrivacyManagerActionStatus: loggedFunction('onPrivacyManagerActionStatus', function (consents) {
      // consents: { "all|some|none" }
      amp.purposeConsent = (consents === 'all') ? ACCEPT_ALL : 'consents'
    }),
    onPMCancel: loggedFunction('onPMCancel', function () {
      if(amp.userTriggered()) amp.dismiss();
    }),
    onConsentReady:  loggedFunction('onConsentReady', function (_consentUUID, euconsent) {
      amp.purposeConsent === ACCEPT_ALL ?
        amp.accept({consentStringType: 'TCF V2', gdprApplies: true, additionalConsent: euconsent}) :
        amp.reject({consentStringType: 'TCF V2', gdprApplies: true, additionalConsent: euconsent});
    })
  };
};

export { gdpr_events, ccpa_events, tcfv2_events }
// end sourcepoint_client.js
