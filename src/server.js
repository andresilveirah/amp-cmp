const express = require('express')
const { text: textParser } = require('body-parser')
const logger = require('./logger')

const config = { port: process.env.PORT || 80 }
const consents = { 'SourcePoint': { consented: true } }

const app = express()
app.use(textParser())
app.use('/', express.static('static'))
app.use(logger)

// https://github.com/ampproject/amphtml/blob/master/extensions/amp-consent/amp-consent.md#checkconsenthref
app.post('/consents/check', (req, res) => {
  // TODO: open an PR to add the 'Content-Type: application/json' to <amp-consent>
  const jsonBody = JSON.parse(req.body)
  jsonBody && consents[jsonBody.consentInstanceId] ?
    res.status(200).json({ promptIfUnknown: consents[jsonBody.consentInstanceId].consented }) :
    res.status(400).json({ error: `Key ${jsonBody.consentInstanceId} Not Found` })
})

app.listen(config.port, () => console.log(`AMP Dummy Response - listening on port ${config.port}`))
