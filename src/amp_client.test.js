import AMPClient from './amp_client'

jest.useFakeTimers()
const onAMPMessage = jest.fn()

describe('AMPClient', () => {
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
        expect(onAMPMessage).toHaveBeenCalledWith({ type: 'consent-ui', action: 'ready' })
      })

      it('calls onAMPMessage with \'enter-fullscreen\' in 200 ms', () => {
        const amp = new AMPClient({}, onAMPMessage)
        amp.show()
        jest.advanceTimersByTime(199)
        expect(onAMPMessage).not.toHaveBeenCalledWith({ type: 'consent-ui', action: 'enter-fullscreen' })
        jest.advanceTimersByTime(1)
        expect(onAMPMessage).toHaveBeenCalledWith({ type: 'consent-ui', action: 'enter-fullscreen' })
      })
    })
  })

  describe('actions', () => {
    ['accept', 'reject'].forEach(action => {
      describe(action, () => {
        it('calls onAMPMessage with the correct payload', () => {
          const amp = new AMPClient({}, onAMPMessage)
          const consentString = 'a consent string'
          amp[action](consentString)
          jest.runAllTimers()
          expect(onAMPMessage).toHaveBeenCalledWith({
            type: 'consent-response',
            action,
            info: consentString
          })
        })
      })
    })

    describe('dismiss', () => {
      it('calls onAMPMessage with the correct payload', () => {
        const amp = new AMPClient({}, onAMPMessage)
        amp.dismiss()
        jest.runAllTimers()
        expect(onAMPMessage).toHaveBeenCalledWith({ type: 'consent-response', action: 'dismiss' })
      })
    })
  })
})