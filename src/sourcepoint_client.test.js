import {gdpr_events as SourcePointClient} from './sourcepoint_client'
import AMPClient from './amp_client'

let ampClient = {}
let sourcepoint = {}

const prototypeDoubleOf = (obj) => Object
  .getOwnPropertyNames(obj.prototype)
  .filter(prop => typeof obj.prototype[prop] === 'function')
  .reduce((allProps, prop) => ({ ...allProps, [prop]: jest.fn() }), {})

describe('SourcePointClient', () => {
  beforeEach(() => {
    ampClient = prototypeDoubleOf(AMPClient)
    sourcepoint = SourcePointClient(ampClient)
  })

  describe('onMessageReady', () => {
    it('calls show on amp client', () => {
      sourcepoint.onMessageReady("gdpr")
      expect(ampClient.show).toHaveBeenCalled()
    })
  })

  describe('onMessageChoiceError', () => {
    it('calls dismiss on amp client', () => {
      sourcepoint.onMessageChoiceError("gdpr")
      expect(ampClient.dismiss).toHaveBeenCalled()
    })
  })

  describe('onMessageChoiceSelect', () => {
    describe('when called with choiceType equals to 11 (accept all)', () => {
      it('sets ampClient.purposeConsent to "all"', () => {
        sourcepoint.onMessageChoiceSelect("gdpr", null, 11)
        expect(ampClient.purposeConsent).toBe("all")
      })
    })

    describe('when called with choiceType equals to 12 (show PM)', () => {
      it('calls ampClient.fullscreen', () => {
        sourcepoint.onMessageChoiceSelect("gdpr", null, 12)
        expect(ampClient.fullscreen).toHaveBeenCalled()
      })
    })

    describe('when called with choiceType is different than 11 and 15', () => {
      it('sets ampClient.purposeConsent to "none"', () => {
        sourcepoint.onMessageChoiceSelect("gdpr", null, null)
        expect(ampClient.purposeConsent).toBe("none")
      })
    })
  })

  describe('onPrivacyManagerAction', () => {
    it('sets ampClient.purposeConsent to all if all is passed in', () => {
      sourcepoint.onPrivacyManagerAction("gdpr", 'all')
      expect(ampClient.purposeConsent).toBe("all")
    })
  })

  describe('onPrivacyManagerAction', () => {
    it('sets ampClient.purposeConsent to consents if anything but all is passed in', () => {
      sourcepoint.onPrivacyManagerAction("gdpr", 'none')
      expect(ampClient.purposeConsent).toBe("consents")
    })
  })

  describe('onPMCancel', () => {
    describe('when amp userTriggered is true', () => {
      it('calls dismiss on amp client', () => {
        ampClient.userTriggered = () => true
        sourcepoint.onPMCancel("gdpr")
        expect(ampClient.dismiss).toHaveBeenCalled()
      })
    })

    describe('when amp userTriggered is false', () => {
      it('should not call dismiss on amp client', () => {
        ampClient.userTriggered = () => false
        sourcepoint.onPMCancel("gdpr")
        expect(ampClient.dismiss).not.toHaveBeenCalled()
      })
    })
  })

  describe('onConsentReady', () => {
    describe('when amp.purposeConsent is equal to "all"', () => {
      it('calls accept on amp client with the properly formatted object based on google spec', () => {
        ampClient.purposeConsent = "all";
        const _consentUUID = '12345';
        const euconsent = '97654321.11111';
        const addtlConsent = '1~';
        const consentedToAll = true;
        sourcepoint.onConsentReady("gdpr", _consentUUID, euconsent, addtlConsent, consentedToAll)
        expect(ampClient.accept).toHaveBeenCalledWith(euconsent, {additionalConsent: addtlConsent, consentStatus: "consentedAll", consentStringType: 1, gdprApplies: true})
      })
    })

    describe('when amp.purposeConsent is different than "all"', () => {
      it('calls reject on amp client with the properly formatted object based on google spec', () => {
        ampClient.purposeConsent = "foo"
        const _consentUUID = '12345';
        const euconsent = '97654321.11111';
        const addtlConsent = '1~';
        const consentedToAll = false;
        sourcepoint.onConsentReady("gdpr", _consentUUID, euconsent, addtlConsent, consentedToAll)
        expect(ampClient.reject).toHaveBeenCalledWith(euconsent, {additionalConsent: addtlConsent, consentStatus: "rejectedAny", consentStringType: 1, gdprApplies: true})
      })
    })
  })
})
