import { 
    getAllDrivers, 
    getElementBySelector,
    getElementsBySelector, 
} from "sp-test-core";

export const setupPage = async (driver, path) => {
    const localhost = `http://localhost`;

    let pages = [localhost, `${localhost}:8080`]
    for(let p in pages) {
        // go to a page, so we can clear local storage
        await driver.get([pages[p], 'tests/index.html'].join('/'));

        // delete all cookies
        await driver.manage().deleteAllCookies();
        await driver.executeScript('window.localStorage.clear();');
    }

    // go to default test page
    // TODO - remove script version
    await driver.get([localhost, path].join('/') + "?_sp_version=3.4.0");
}

const __uspapi = async (driver, command) => {
    return driver.executeAsyncScript(`var cb = arguments[arguments.length - 1]; __uspapi('${command}', 1, function(data, success) { cb([data, success]); })`);
}

const addEventListener = async (driver, event) => {
    return driver.executeAsyncScript(`var cb = arguments[arguments.length - 1]; window._sp_.addEventListener('${event}', function() { cb(arguments); })`);
}

const drivers = getAllDrivers();

let driver;

jest.setTimeout(30 * 1000);

drivers.forEach((d) => {
    beforeAll(async () => {
        driver = d.build();
    });

    afterAll(() => {
        d.quit();
    });

    describe(`CCPA accept FL`, () => {
        it('should load the page', async () => {
            await setupPage(driver, 'tests/unified-ccpa.html');
        });

        it('should load the message', async () => {
            let ampConsentIframe = await getElementBySelector(driver, 'amp-consent > iframe');
            await  driver.switchTo().frame(ampConsentIframe);

            let flIframe = await getElementBySelector(driver, '[id^="sp_message_iframe_"]');
            return driver.switchTo().frame(flIframe);
        });

        it('should allow us to accept all from the message', async () => {
            // wait for animation to finish
            await new Promise((resolve) => { setTimeout(resolve, 1000) })
            // click accept
            const acceptButton = await getElementBySelector(driver, '[title*="Accept"]');
            await acceptButton.click();
        });

        it(`should let us open the PM from the consent-ui`, async () => {
            await driver.switchTo().defaultContent();

            const pmButton = await getElementBySelector(driver, '#consent-ui');
            await pmButton.click();

            let consentFrame = await getElementBySelector(driver, 'amp-consent > iframe');
            await driver.switchTo().frame(consentFrame);

            let pmIframe = await getElementBySelector(driver, '[id^="sp_message_iframe_"][src*="/ccpa_pm/"]');
            await driver.switchTo().frame(pmIframe);
        })
    })

    describe(`CCPA accept PM`, () => {
        it('should load the page', async () => {
            await setupPage(driver, 'tests/unified-ccpa.html');
        });

        it('should load the message', async () => {
            let consentFrame = await getElementBySelector(driver, 'amp-consent > iframe');
            await driver.switchTo().frame(consentFrame);

            let flIframe = await getElementBySelector(driver, '[id^="sp_message_iframe_"]');
            return driver.switchTo().frame(flIframe);
        });

        it(`should open the PM`, async () => {
            // wait for animation to finish
            await new Promise((resolve) => { setTimeout(resolve, 1000) })
            // click accept
            const optionsButton = await getElementBySelector(driver, '[title*="Settings"]');
            await optionsButton.click();

            await driver.switchTo().defaultContent();
            let consentFrame = await getElementBySelector(driver, 'amp-consent > iframe');
            await driver.switchTo().frame(consentFrame);

            let pmIframe = await getElementBySelector(driver, '[id^="sp_message_iframe_"][src*="/ccpa_pm/"]');
            await driver.switchTo().frame(pmIframe);

            const saveAndExitButton = await getElementBySelector(driver, '[title*="SAVE & EXIT"]');
            await saveAndExitButton.click();
        })
    })

    describe(`CCPA reject PM`, () => {
        it('should load the page', async () => {
            await setupPage(driver, 'tests/unified-ccpa.html');
        });

        it('should load the message', async () => {
            let consentFrame = await getElementBySelector(driver, 'amp-consent > iframe');
            await driver.switchTo().frame(consentFrame);

            let flIframe = await getElementBySelector(driver, '[id^="sp_message_iframe_"]');
            return driver.switchTo().frame(flIframe);
        });

        it(`should open the PM`, async () => {
            // wait for animation to finish
            await new Promise((resolve) => { setTimeout(resolve, 1000) })
            // click accept
            const optionsButton = await getElementBySelector(driver, '[title*="Settings"]');
            await optionsButton.click();

            await driver.switchTo().defaultContent();
            let consentFrame = await getElementBySelector(driver, 'amp-consent > iframe');
            await driver.switchTo().frame(consentFrame);

            let pmIframe = await getElementBySelector(driver, '[id^="sp_message_iframe_"][src*="/ccpa_pm/"]');
            await driver.switchTo().frame(pmIframe);

            const toggle = await getElementBySelector(driver, '.pm-switch .slider');
            await toggle.click();

            const saveAndExitButton = await getElementBySelector(driver, '[title*="SAVE & EXIT"]');
            await saveAndExitButton.click();
        })
    })
});