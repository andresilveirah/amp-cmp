const params = new URLSearchParams(new URL(window.location).search)
const siteId = parseInt(params.get('siteId'))
const accountId = parseInt(params.get('accountId'))
const siteName = params.get('siteName')
const privacyManagerId = params.get('privacyManagerId')
const stageCampaign = params.get('stageCampaign') === "false" ? false : true
console.log(siteId, accountId, siteName, privacyManagerId, stageCampaign)
const template = `
<!doctype html>
<html amp lang="en">
  <head>
    <meta charset="utf-8">
    <title>Hello, AMPs</title>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
    <script async custom-element="amp-consent" src="https://cdn.ampproject.org/v0/amp-consent-0.1.js"></script>
    <script async custom-element="amp-sticky-ad" src="https://cdn.ampproject.org/v0/amp-sticky-ad-1.0.js"></script>
    <script async custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
    <link rel="canonical" href="./index.html">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <meta name="amp-consent-blocking" content>
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <style amp-custom>
      :root {
        --space-2: 1rem;   /* 16px */
        --space-3: 1.5rem; /* 24px */
        --blue: #0385CD;
        --gray-light: #f3f5f7;
        --gray-dark: #565867;
        --font-size: 16px;
      }
      * {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        margin-top: 0;
      }
      html,body,div {
        margin: 0;
        padding: 0;
        background-color: var(--gray-light);
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      }
      header, footer {
        background-color: var(--blue);
        color: white;
      }
      article {
        padding: 16px;
        background-color: white;
        color: var(--gray-dark);
        line-height: 26px;
        font-weight: 400;
      }
      code, pre {
        background-color: #F6F8FA;
        padding: 2px;
        font-size: var(--font-size);
      }
      .wrap {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1em;
      }
      #primary{
        max-width: 800px;
        margin: 0 auto;
      }
      #privacy-settings-prompt {
        background-color: var(--blue);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--space-3);
      }
      #privacy-settings-prompt button {
        cursor: pointer;
        border: none;
        background-color: inherit;
        color: white;
        font-size: var(--font-size);
        line-height: 26px;
        font-weight: 400;
      }
      .ad-item {
        display: block;
        float: left;
        padding: 0 50px;
      }
      #ads-container {
        max-width: 800px;
        height: 250px;
        margin: 0 auto;
        padding: 0;
      }
      @media (max-width: 800px) {
        .ad-item {
          width: 100%;
          padding: 0 5px;
          text-align: center;
        }
      }
      .clear::after {
        content: "";
        clear: both;
        display: table;
      }
    </style>
  </head>
  <body>
    <amp-consent id='consent' layout='nodisplay' type="SourcePoint">
      <script type="application/json">
        {
          "postPromptUI": "privacy-settings-prompt",
          "clientConfig": {
            "accountId": ${accountId},
            "siteName": "${siteName}",
            "siteId": ${siteId},
            "privacyManagerId": "${privacyManagerId}",
            "stageCampaign": ${stageCampaign}
          }
        }
      </script>
      <div id="privacy-settings-prompt">
        <button on="tap:consent.prompt(consent=SourcePoint)">Privacy Settings</button>
      </div>
    </amp-consent>
    <header>
      <nav class="wrap">
        <a href="https://sourcepoint.com" target="_blank">
          <amp-img
            alt="SourcePoint Logo"
            width="160"
            height="21"
            src="https://uploads-ssl.webflow.com/57d30b6aa1924bb30d7ae290/57d30b6aa1924bb30d7ae3f2_Sourcepoint-Logo.svg"></amp-img>
        </a>
      </nav>
    </header>
    <ul id="ads-container">
      <li class="ad-item">
        <amp-ad type="industrybrains"
          width="300"
          height="250"
          data-width="300"
          data-height="250"
          data-cid="19626-3798936394"
        >
          <div placeholder>Loading...</div>
        </amp-ad>
      </li>
      <li class="ad-item">
        <amp-embed width=100 height=100
            type=taboola
            layout=responsive
            heights="(min-width:780px) 64%, (min-width:480px) 98%, (min-width:460px) 167%, 196%"
            data-publisher="amp-demo"
            data-mode="thumbnails-a"
            data-placement="Responsive example - AMP"
            data-article="auto">
        </amp-embed>
      </li>
    </ul>
    <div class="clear"></div>
    <article id="primary">
      <h1>AMP Project</h1>
      <section>
        <p>
          This is a AMP-enabled website demonstrating how <a href="https://www.sourcepoint.com/consent">SourcePoint's Privacy Manager</a> can be used when the <code>&lt;amp-consent&gt;</code> tag is <a href="https://github.com/ampproject/amphtml/issues/15651">fully implemented</a>.
        </p>
        <p>
          Here at the top are two ads loaded with <code>&lt;amp-ad&gt;</code>. The first one contains the attribute <code>data-block-on-consent</code> meaning that it won't be loaded until the consent user has given consent to the vendors through the consent flow.
        </p>
        <p>
          At the moment, the flow we're "loading a flow" that does not require the Privacy Manager to be displayed. In the <code>&lt;amp-consent&gt;</code> configuration, changing the consent ID from <code>"very-long-key-2"</code> to <code>"very-long-key-1"</code> will trigger a response to <code>&lt;amp-consent&gt;</code> that requires the Privacy Manager to be open and the ads will wait for the consent to be displayed.
        </p>
        <h3>TODO: </h2>
        <p>
          The <code>&lt;amp-consent&gt;</code> component loads the Privacy Manager in a fully sandboxed <code>&lt;amp-iframe&gt;</code> and the only way to communicate between the Privacy Manager and the publisher's website is by <a href="https://www.ampproject.org/docs/reference/components/amp-consent#prompt-actions-from-external-consent-ui">calling the following "hook" function:</a><pre>
  window.parent.postMessage({
    type: 'consent-response',
    action: 'accept/reject/dismiss'
  }, '*');</pre>
          This hook function needs to be called, for example, when the user clicks on "Save & Close" from within the Privacy Manager.
        </p>
        <p>
          We also need to implement the specific response expected by the <code>&lt;amp-consent&gt;</code> component. <a href="https://amp-response.herokuapp.com/">The is the mock server</a> used in this example page has more informations about the API.
        </p>
        <amp-img
          layout="responsive"
          width="600"
          height="600"
          alt="SourcePoint CMP"
          src="https://uploads-ssl.webflow.com/57d30b6aa1924bb30d7ae290/5aeb5adad7dc70b00c5fb642_Consent-mock-mobile.jpg">
        </amp-img>
      </section>
    </article>
  </body>
</html>`
const container = document.getElementById('container')
const iframe = document.createElement('iframe')
iframe.srcdoc = template
iframe.style = "position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
container.appendChild(iframe)