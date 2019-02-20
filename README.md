# SourcePoint **AMP** Mock Server

This mock server to exemplify how to use AMP's consent component. The `<amp-consent>` component will make a `POST` call to the URL included in its configuration (in our case, [https://amp-response.herokuapp.com/consents/check](https://amp-response.herokuapp.com/consents/check)), passing the following parameter:

    {
      "consentInstanceId": "very-long-key-1" // or "very-long-key-2"
    }

and we give back the following response:

    {
      "promptIfUnknown": "true" // or false
    }

For more information check the AMP's consent component [documentation](https://www.ampproject.org/docs/reference/components/amp-consent#consent-instance-id).
