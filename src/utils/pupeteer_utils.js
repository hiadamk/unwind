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

    await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' });


    // Get the height of the rendered page
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();

    // Scroll one viewport at a time, pausing to let content load
    const viewportHeight = page.viewport().height;
    let viewportIncr = 0;
    while (viewportIncr + viewportHeight < height) {
        await page.evaluate(_viewportHeight => {
        window.scrollBy(0, _viewportHeight);
        }, viewportHeight);
        await wait(20);
        viewportIncr = viewportIncr + viewportHeight;
    }

    // Scroll back to top
    await page.evaluate(_ => {
        window.scrollTo(0, 0);
    });

    // Some extra delay to let images load
    await wait(200);
    
    const image = await page.screenshot({fullPage: true, encoding: 'binary', fromSurface: true});
    await browser.close();
    return image;
}