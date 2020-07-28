const puppeteer = require('puppeteer');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

module.exports = {
    getScreenshot: getScreenshot,
};


async function getScreenshot(html) {
    const browser = await puppeteer.launch({
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
        ]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 100, deviceScaleFactor: 2 });
    await page.setContent(html, {waitUntil: 'networkidle0'});
    const image = await page.screenshot({ fullPage: true, encoding: 'binary' });
    const compressed = await imagemin.buffer(image,{
		plugins: [
			imageminPngquant({
                quality: [0.7, 0.9],
                speed: 1
            })
		]
	})
    await browser.close();
    return compressed;
}