import SourcePointClient from './sourcepoint_client'

let ampClient = {}
let sourcepoint = {}

describe('SourcePointClient', () => {
  beforeEach(() => {
    ampClient = {
      show: jest.fn(),
      dismiss: jest.fn(),
      userTriggered: jest.fn(),
      accept: jest.fn(),
      reject: jest.fn()
    }
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
    describe('when called with choiceType equals to 11', () => {
      it('sets ampClient.purposeConsent to "all"', () => {
        sourcepoint.onMessageChoiceSelect(null, 11)
        expect(ampClient.purposeConsent).toBe("all")
      })
    })

    describe('when called with choiceType is different than 11', () => {
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