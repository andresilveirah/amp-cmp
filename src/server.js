const express = require('express')
const { text: textParser } = require('body-parser')
const logger = require('./logger')

const config = { port: process.env.PORT || 80 }

const app = express()

app.use(textParser())
app.use('/', express.static('static'))
app.use(logger)

// https://github.com/ampproject/amphtml/blob/master/extensions/amp-consent/amp-consent.md#checkconsenthref
app.post('/consents/check', (_req, res) => {
  // TODO: open an PR to add the 'Content-Type: application/json' to <amp-consent>
  res.status(200).json({ promptIfUnknown: yes })
})

app.listen(config.port, () => console.log(`AMP Dummy Response - listening on port ${config.port}`))
