const puppeteer = require('puppeteer');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

module.exports = {
    getScreenshot: getScreenshot,
};

async function getScreenshot(html, resolution) {

    var res;

    if(resolution == 'high'){
        res = 2;
    }else if(resolution == 'medium'){
        res = 1.5;
    }else if(resolution == 'low'){
        res = 1;
    }else{
        return new Buffer.alloc(0)
    }

    const browser = await puppeteer.launch({
        'args': process.env.PUPPETEER_LAUNCH_ARGS.split(' ')
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36')
    await page.setViewport({ width: 600, height: 100, deviceScaleFactor: res });
    await page.goto("about:blank")
    await page.setContent(html, {waitUntil: 'networkidle0'});
    const image = await page.screenshot({ fullPage: true, encoding: 'binary' });
    const compressed = await imagemin.buffer(image,{
		plugins: [
			imageminPngquant({
                quality: [0.3, 0.5],
                speed: 8,
                strip : true,
                dithering : 0.5
            })
		]
    }).catch((err) => console.log(err))
    await browser.close();
    return compressed;
}