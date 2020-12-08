import {tcfv2_events as SourcePointClient} from './sourcepoint_client'
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
      sourcepoint.onMessageReady()
      expect(ampClient.show).toHaveBeenCalled()
    })
  })

  describe('onMessageChoiceError', () => {
    it('calls dismiss on amp client', () => {
      sourcepoint.onMessageChoiceError()
      expect(ampClient.dismiss).toHaveBeenCalled()
    })
  })

  describe('onSPPMObjectReady', () => {
    describe('when amp userTriggered is true', () => {
      it('calls show on amp client', () => {
        ampClient.userTriggered = () => true
        sourcepoint.onSPPMObjectReady()
        expect(ampClient.show).toHaveBeenCalled()
      })
    })

    describe('when amp userTriggered is false', () => {
      it('should not call show on amp client', () => {
        ampClient.userTriggered = () => false
        sourcepoint.onSPPMObjectReady()
        expect(ampClient.show).not.toHaveBeenCalled()
      })
    })
  })

  describe('onMessageChoiceSelect', () => {
    describe('when called with choiceType equals to 11 (accept all)', () => {
      it('sets ampClient.purposeConsent to "all"', () => {
        sourcepoint.onMessageChoiceSelect(null, 11)
        expect(ampClient.purposeConsent).toBe("all")
      })
    })

    describe('when called with choiceType equals to 12 (show PM)', () => {
      it('calls ampClient.fullscreen', () => {
        sourcepoint.onMessageChoiceSelect(null, 12)
        expect(ampClient.fullscreen).toHaveBeenCalled()
      })
    })

    describe('when called with choiceType is different than 11 and 15', () => {
      it('sets ampClient.purposeConsent to "none"', () => {
        sourcepoint.onMessageChoiceSelect(null, null)
        expect(ampClient.purposeConsent).toBe("none")
      })
    })
  })

  describe('onPrivacyManagerAction', () => {
    it('sets ampClient.purposeConsent to whatever value consents.purposeConsent has', () => {
      sourcepoint.onPrivacyManagerAction({ purposeConsent: "foo" })
      expect(ampClient.purposeConsent).toBe("foo")
    })
  })

  describe('onPMCancel', () => {
    describe('when amp userTriggered is true', () => {
      it('calls dismiss on amp client', () => {
        ampClient.userTriggered = () => true
        sourcepoint.onPMCancel()
        expect(ampClient.dismiss).toHaveBeenCalled()
      })
    })

    describe('when amp userTriggered is false', () => {
      it('should not call dismiss on amp client', () => {
        ampClient.userTriggered = () => false
        sourcepoint.onPMCancel()
        expect(ampClient.dismiss).not.toHaveBeenCalled()
      })
    })
  })

  describe('onConsentReady', () => {
    describe('when amp.purposeConsent is equal to "all"', () => {
      it('calls accept on amp client passing whatever was received as euconsent param', () => {
        ampClient.purposeConsent = "all"
        sourcepoint.onConsentReady(null, "foo")
        expect(ampClient.accept).toHaveBeenCalledWith("foo")
      })
    })

    describe('when amp.purposeConsent is different than "all"', () => {
      it('calls reject on amp client passing whatever was received as euconsent param', () => {
        ampClient.purposeConsent = "foo"
        sourcepoint.onConsentReady(null, "foo")
        expect(ampClient.reject).toHaveBeenCalledWith("foo")
      })
    })
  })
})