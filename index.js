var express = require('express');
var bodyParser = require('body-parser');

var loggerMiddleWare = function (req, _res, next) {
  console.log('%s %s %s', req.method, req.url, req.path)
  next()
}

var config = {
  port: process.env.PORT || 80
}

var consents = {
  "very-long-key-1": {
    consented: true
  },
  "very-long-key-2": {
    consented: false
  }
};

var app = express();
app.use(bodyParser.text());
app.use(loggerMiddleWare);
app.use('/', express.static('static'));

app.post('/consents/check', function(req, res) {
  // Necessary for AMP CORS security protocol.
  // @see https://github.com/ampproject/amphtml/blob/master/spec/amp-cors-requests.md
  res.setHeader('AMP-Access-Control-Allow-Source-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', "true");
  res.setHeader('Access-Control-Allow-Origin', req.query.allowedDomain);

  // TODO: open an PR to add the 'Content-Type: application/json' to <amp-consent>
  var jsonBody = JSON.parse(req.body);

  if (jsonBody && consents[jsonBody.consentInstanceId]) {
    res.status(200).json({ "promptIfUnknown": consents[jsonBody.consentInstanceId].consented });
  } else {
    res.status(400).json({ error: 'Key '+jsonBody.consentInstanceId+' Not Found' });
  }
});

app.get('/version', function (_req, res) {
  res.status(200).json("1");
});

app.listen(config.port, function () {
  console.log('AMP Dummy Response - listening on port '+config.port);
});
