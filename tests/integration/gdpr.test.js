import { 
    getAllDrivers, 
    getElementBySelector,
    getElementsBySelector, 
} from "sp-test-core";
import {
    expectMessageClosed,
    expectNoConsoleErrors
} from "sp-test-core/dist/assertions";
import { By } from "selenium-webdriver";

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
    await driver.get([localhost, path].join('/'));
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

    describe.each([
        ['new config', 'tests/unified-gdpr.html'],
        ['legacy config', 'tests/legacy-gdpr.html']
    ])(`GDPR accept FL (%s)`, (name, path) => {
        it('should load the page', async () => {
            await setupPage(driver, path);
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

            let pmIframe = await getElementBySelector(driver, '[id^="sp_message_iframe_"][src*="/privacy-manager/"]');
            await driver.switchTo().frame(pmIframe);
        })

        it(`should dismiss the PM when opened by the user`, async () => {
            const dismissButton = await getElementBySelector(driver, '[title*="Cancel"]');
            await dismissButton.click();

            // wait for animation to finish
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            const messageIframes = await driver.findElements(By.css('amp-consent > iframe'));
            expect(messageIframes.length).toBe(0);
        })

        it(`should have no js errors`, async () => {
            return expectNoConsoleErrors(driver);
        })
    })

    describe.each([
        ['new config', 'tests/unified-gdpr.html'],
        ['legacy config', 'tests/legacy-gdpr.html']
    ])(`GDPR accept PM (%s)`, (name, path) => {
        it('should load the page', async () => {
            await setupPage(driver, path);
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
            const optionsButton = await getElementBySelector(driver, '[title*="Options"]');
            await optionsButton.click();

            await driver.switchTo().defaultContent();
            let consentFrame = await getElementBySelector(driver, 'amp-consent > iframe');
            await driver.switchTo().frame(consentFrame);

            let pmIframe = await getElementBySelector(driver, '[id^="sp_message_iframe_"][src*="/privacy-manager/"]');
            await driver.switchTo().frame(pmIframe);

            const acceptAll = await getElementBySelector(driver, '[title*="Accept All"]');
            await acceptAll.click();
        })

        it(`should have dismissed the message`, async () => {
            // wait for animation to finish
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            return expectMessageClosed(driver, 'amp-consent > iframe')
        })

        it(`should have no js errors`, async () => {
            return expectNoConsoleErrors(driver);
        })
    })

    describe.each([
        ['new config', 'tests/unified-gdpr.html'],
        ['legacy config', 'tests/legacy-gdpr.html']
    ])(`GDPR reject PM (%s)`, (name, path) => {
        it('should load the page', async () => {
            await setupPage(driver, path);
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
            const optionsButton = await getElementBySelector(driver, '[title*="Options"]');
            await optionsButton.click();

            await driver.switchTo().defaultContent();
            let consentFrame = await getElementBySelector(driver, 'amp-consent > iframe');
            await driver.switchTo().frame(consentFrame);

            let pmIframe = await getElementBySelector(driver, '[id^="sp_message_iframe_"][src*="/privacy-manager/"]');
            await driver.switchTo().frame(pmIframe);

            const toggle = await getElementBySelector(driver, '.pm-switch .slider');
            await toggle.click();

            const rejectAll = await getElementBySelector(driver, '[title*="Reject All"]');
            await rejectAll.click();
        })

        it(`should have dismissed the message`, async () => {
            // wait for animation to finish
            await new Promise((resolve) => { setTimeout(resolve, 1000) })

            return expectMessageClosed(driver, 'amp-consent > iframe')
        })

        it(`should have no js errors`, async () => {
            return expectNoConsoleErrors(driver);
        })
    })
});