import AMPClient from './amp_client'

jest.useFakeTimers()
let onAMPMessage
const defaultPayload = { initialHeight: '60vh', enableBorder: false }

describe('AMPClient', () => {
  beforeEach(() => { onAMPMessage = jest.fn() });

  describe('userTriggered', () => {
    describe('when config.promptTrigger is \'action\'', () => {
      it('returns true', () => {
        const amp = new AMPClient({ promptTrigger: 'action' })
        expect(amp.userTriggered()).toBe(true)
      })
    })

    describe('when config.promptTrigger is different than \'action\'', () => {
      it('returns true', () => {
        const amp = new AMPClient({ promptTrigger: 'anything' })
        expect(amp.userTriggered()).toBe(false)
      })
    })
  })

  describe('ui', () => {
    describe('show', () => {
      it('calls onAMPMessage with \'ready\' imediately', () => {
        const amp = new AMPClient({}, onAMPMessage)
        amp.show()
        expect(onAMPMessage).toHaveBeenCalledWith({
          ...defaultPayload,
          type: 'consent-ui',
          action: 'ready'
        })
      })
    })
  })

  describe('actions', () => {
    ['accept', 'reject'].forEach(action => {
      describe(action, () => {
        it('calls onAMPMessage with the correct payload', () => {
          const amp = new AMPClient({}, onAMPMessage)
          const consentString = 'a consent string'
          amp[action](consentString, {})
          jest.runAllTimers()
          expect(onAMPMessage).toHaveBeenCalledWith({
            ...defaultPayload,
            type: 'consent-response',
            action,
            info: consentString,
            consentMetadata: {},
          })
        })
      })
    })

    describe('dismiss', () => {
      it('calls onAMPMessage with the correct payload', () => {
        const amp = new AMPClient({}, onAMPMessage)
        amp.dismiss()
        jest.runAllTimers()
        expect(onAMPMessage).toHaveBeenCalledWith({
          ...defaultPayload,
          type: 'consent-response',
          action: 'dismiss'
        })
      })
    })
  })
})