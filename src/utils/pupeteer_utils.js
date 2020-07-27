const puppeteer = require('puppeteer');

module.exports = {
    getScreenshot: getScreenshot,
};

function wait (ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }

async function getScreenshot(html){
    const browser = await puppeteer.launch({
        'args' : [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 100, deviceScaleFactor: 2 });

    await page.goto(`data:text/html,${html}`, { waitUntil: 'load' });
    
    const image = await page.screenshot({fullPage: true, encoding: 'binary'});
    await browser.close();
    return image;
}