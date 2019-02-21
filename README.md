# SourcePoint **AMP** Mock Server

This mock server to exemplify how to use AMP's consent component. The `<amp-consent>` component will make a `POST` call to the URL included in its configuration (in our case, [https://amp-response.herokuapp.com/consents/check?allowedDomain=[YOUR DOMAIN]](https://amp-response.herokuapp.com/), passing the following parameter:

    {
      "consentInstanceId": "very-long-key-1" // or "very-long-key-2"
    }

and we give back the following response:

    {
      "promptIfUnknown": "true" // or false
    }

## Known limitations of `<amp-consent>`

The `<amp-consent>` component is fairly new and it is still [in development](https://github.com/ampproject/amphtml/issues/15651). Here are its main limitations:

* No support to the [IAB framework](https://iabtechlab.com/standards/gdpr-transparency-and-consent-framework/)
* No support of individual purpose or vendor consents
* Limited events/hooks for consent and rejection actions

For more information check the AMP's consent component [documentation](https://www.ampproject.org/docs/reference/components/amp-consent#consent-instance-id).
