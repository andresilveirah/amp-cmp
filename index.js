var express = require('express');

var app = express();
app.use(express.json());
app.use(express.urlencoded());

var consents = {
  "very-long-key-1": {
    "consented": true
  },
  "very-long-key-2": {
    "consented": false
  }
};

app.post('/consents/check', function(req, res) {
  // Necessary for AMP CORS security protocol.
  // @see https://github.com/ampproject/amphtml/blob/master/spec/amp-cors-requests.md
  res.setHeader('AMP-Access-Control-Allow-Source-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin:', '*');

  if (consents[req.body.consentInstanceId]) {
    res.status(200).json({ "promptIfUnknown": consents[req.body.consentInstanceId] });
  } else {
    res.status(400).json({ error: 'Key '+req.body.consentInstanceId+' Not Found' });
  }
});

app.listen(3000, function () {
  console.log('AMP Dummy Response - listening on port 3000!');
});
