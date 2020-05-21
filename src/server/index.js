const express = require('express')
const { text: textParser } = require('body-parser')
const logger = require('./logger')

const config = { port: process.env.PORT || 80 }

const app = express()

app.use(textParser())
app.use('/', express.static('static'))
app.use('/dist', express.static('dist'))
app.use(logger)

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost")
  res.header('Access-Control-Allow-Credentials', "true")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// https://github.com/ampproject/amphtml/blob/master/extensions/amp-consent/amp-consent.md#checkconsenthref
app.post('/consents/check', (_req, res) => {
  // TODO: open an PR to add the 'Content-Type: application/json' to <amp-consent>
  res.status(200).json({ promptIfUnknown: true })
})

app.post('/consents/checkCCPA', (_req, res) => {
  // TODO: open an PR to add the 'Content-Type: application/json' to <amp-consent>
  const ampConsentStateValue = JSON.parse(_req.body).consentStateValue;
  const consentStateValue = (ampConsentStateValue == "accepted" || ampConsentStateValue == 'unknown') ? "accepted" : ampConsentStateValue;
  let expireCache = false;

  if (JSON.parse(_req.body).clientConfig.showNoticeUntilAction == true && ampConsentStateValue == 'unknown') {
    expireCache = true;
  }
  res.status(200).json({
    "consentRequired": true,
    "expireCache": expireCache,
    "consentStateValue": consentStateValue
  })
})

app.listen(config.port, () => console.log(`AMP - listening on port ${config.port}`))
