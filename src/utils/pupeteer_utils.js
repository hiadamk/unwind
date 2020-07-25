const puppeteer = require('puppeteer');

module.exports = {
    getScreenshot: getScreenshot,
};

async function getScreenshot(html){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 400, deviceScaleFactor: 2 });

    await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' });
    const image = await page.screenshot({fullPage: true, encoding: 'binary', });
    await browser.close();
    return image;
}