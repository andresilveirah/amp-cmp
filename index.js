var express = require('express');

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var config = {
  port: process.env.PORT || 3000
}

var consents = {
  "very-long-key-1": {
    "consented": true
  },
  "very-long-key-2": {
    "consented": false
  }
};

app.use('/', express.static('static'));

app.post('/consents/check', function(req, res) {
  // Necessary for AMP CORS security protocol.
  // @see https://github.com/ampproject/amphtml/blob/master/spec/amp-cors-requests.md
  res.setHeader('AMP-Access-Control-Allow-Source-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', "true");
  res.setHeader('Access-Control-Allow-Origin', req.query.allowedDomain);

  if (req.body.consentInstanceId && consents[req.body.consentInstanceId]) {
    res.status(200).json({ "promptIfUnknown": consents[req.body.consentInstanceId].consented });
  } else {
    res.status(400).json({ error: 'Key '+req.body.consentInstanceId+' Not Found' });
  }
});

app.get('/version', function (_req, res) {
  res.status(200).json("1");
});

app.listen(config.port, function () {
  console.log('AMP Dummy Response - listening on port '+config.port);
});
