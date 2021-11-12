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

function ccpa_events(amp) {
  // consent string(uspString):
  // version|explicit_notice_shown|user_optout_of_sale
  let consentReadyCount = 0;  // # of consent readies we've seen so far
  let expectedConsentReadies = 2; // # we expect to see, 2 if we have a message, will be adjusted to 1 if we dont have one

  return {
    // show message once its ready
    onMessageReady: loggedFunction('onMessageReady', function (category) {
      if (category === "ccpa") {
        amp.show();
      }
    }),
    // enter full screen for PM
    onMessageChoiceSelect: loggedFunction('onMessageChoiceSelect', function (category, choice_id, choiceType) {
      if (category === "ccpa") {
        switch(choiceType) {
          case SHOW_PM_CHOICE_TYPE:
            amp.fullscreen();
            break;
          default:
            break;

        }
      }
    }),
    // dimiss message on error
    onMessageChoiceError: loggedFunction('onMessageChoiceError', function (category, err) {
      if (category === "ccpa") {
        amp.dismiss();
      }
    }),
    // pass up consent status once its ready
    onConsentReady: loggedFunction('onConsentReady', function (category, uuid, uspString) {
      if (category === "ccpa") {
        if (++consentReadyCount >= expectedConsentReadies) {
          if (typeof uspString == "string") {
            if (uspString[2] === "N") {
              amp.accept(uspString)
            } else {
              amp.reject(uspString)
            }
          } else {
            amp.dismiss()
          }
        }
      }
    }),
    // dismiss PM if user opened PM themselves and canceled
    onPMCancel: loggedFunction('onPMCancel', function (category) {
      if (category === "ccpa") {
        if(amp.userTriggered()) {
          amp.dismiss();
        }
      }
    }),
    // adjust our expected onConsentReadies if we don't have a message to show
    onMessageReceiveData: loggedFunction('onMessageReceiveData', function (category, data) {
      if (category === "ccpa") {
        if (!amp.userTriggered() && data.messageId==0) { 
          // we don't have a message and we're not showing a PM, so we will only have one onConsentReady
          expectedConsentReadies--;
        }
      }
    }),
    // show PM if user opened it
    onSPPMObjectReady: loggedFunction('onSPPMObjectReady', function () {
      if(amp.userTriggered()) {
        amp.show();
      }
    })
  };
};

function gdpr_events(amp) {
  return {
    onMessageReady: loggedFunction('onMessageReady', function(category) {
      if (category === "gdpr") {
        amp.show();
      }
    }),
    onMessageChoiceError: loggedFunction('onMessageChoiceError', function (category, error) {
      if (category === "gdpr") {
        console.error(error)
        amp.dismiss();
      }
    }),
    onMessageChoiceSelect: loggedFunction('onMessageChoiceSelect', function (category, _choiceId, choiceType) {
      if (category === "gdpr") {
        switch(choiceType) {
          case SHOW_PM_CHOICE_TYPE:
            amp.fullscreen();
            break;
          case ACCEPT_ALL_CHOICE_TYPE: // TODO - is this needed? - amp.purposeConsent does not seem to be used
            amp.purposeConsent = ACCEPT_ALL;
            break;
          default: // TODO - is this needed? - amp.purposeConsent does not seem to be used
            amp.purposeConsent = REJECT_ALL
        }
      }
    }),
    // TODO - is this needed? - amp.purposeConsent does not seem to be used
    onPrivacyManagerAction: loggedFunction('onPrivacyManagerAction', function (category, consents) {
      if (category === "gdpr") {
        amp.purposeConsent = (consents === 'all') ? ACCEPT_ALL : 'consents'
      }
    }),
    // TODO - is this needed? - amp.purposeConsent does not seem to be used
    onPrivacyManagerActionStatus: loggedFunction('onPrivacyManagerActionStatus', function (category, consents) {
      if (category === "gdpr") {
        amp.purposeConsent = (consents === 'all') ? ACCEPT_ALL : 'consents'
      }
    }),
    onPMCancel: loggedFunction('onPMCancel', function (category) {
      if (category === "gdpr") {
        if(amp.userTriggered()) amp.dismiss();
      }
    }),
    onConsentReady:  loggedFunction('onConsentReady', function (category, _consentUUID, euconsent, {addtlConsent, consentedToAll}) {
      if (category === "gdpr") {
        consentedToAll ?
          amp.accept(euconsent, {consentStringType: 2, gdprApplies: true, additionalConsent: addtlConsent, consentStatus: 'consentedAll'}) :
          amp.reject(euconsent, {consentStringType: 2, gdprApplies: true, additionalConsent: addtlConsent, consentStatus: 'rejectedAny'});
      }
    })
  };
};

export { gdpr_events, ccpa_events }
// end sourcepoint_client.js
