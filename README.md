# SourcePoint **AMP**
[![Maintainability](https://api.codeclimate.com/v1/badges/8d731d4e2661140f688d/maintainability)](https://codeclimate.com/github/SourcePointUSA/amp-client/maintainability)

1. Install the dependencies with
```
npm i
```

2. Open two tabs on your console and run:
```
npm run server
```
```
npm run ui
```

3. On your browser, visit `http://localhost/examples/unified.html`


Helpful Hints:

Turn on the "experimental channel" here - https://cdn.ampproject.org/experiments.html

And it will enable amp-geo spoofing using #amp-geo={{ country code }}

Use the following query params to dynamically change configs:

`_sp_version` : use a particular version of the unified script
`sp_test_env` : will override the config `baseEndpoint`. Possible values: `stage`, `preprod` 
`sp_wrapper_env`: will override the config `wrapperAPIOrigin`. Possible values `stage`