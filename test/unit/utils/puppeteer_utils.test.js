const puppeteer_utils = require("../../../src/utils/puppeteer_utils");
const fs = require("fs");
const path = require("path");

describe('getScreenshot',() => {


    const tweet_html_1 = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <!-- Required meta tags -->
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        
            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="styles.css">
            <title>Tweet</title>
            <script src="https://twemoji.maxcdn.com/v/latest/twemoji.min.js" crossorigin="anonymous"></script>
            <style type="text/css">
                body {
                    background-color: white;
                }
                
                p {
                    color: black;
                }
                
                .container {
                    max-width: 600px;
                }
                
                .avatar {
                    vertical-align: middle;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                }
                
                .vertical-line{
                    border-left: 2px dashed grey;
                    height: 35px;
                    position: relative;
                    left: 300px;
                }
                
                .handle{
                    color: gray;
                }
                
                .tweet-body{
                    display: block;
                }
                
                .rounded-image{
                    border-radius: 16px;
                    margin-top: 16px;
                }
                
                .url{
                    color: blue;
                }
                
                .card-text {
                    word-wrap: break-word;
                }
                img.emoji {
                    height: 1em;
                    width: 1em;
                    margin: 0 .05em 0 .1em;
                    vertical-align: -0.1em;
                 }
            </style>
        </head>
        <body>
            
<div class="container my-3">
<div class="card">
    <div class="card-body">
        <!-- Header area -->
        <div class="row">
            <div class="col-2-sm mt-3 ml-4">
                <img class="avatar m-1" src="https://pbs.twimg.com/profile_images/1100035505335472129/vJMP1Wkc.jpg">
            </div>
            <div class="col-9-sm mt-3 ml-4">
                <div class="row mb-0">
                    <p class="mb-1 mt-2">Stonewood Silk</p>
                </div>
                <div class="row">
                    <p class="handle">@SilkOfStonewood</p>
                </div>
            </div>
        
        </div>

        <!-- Body Area -->
        
        <div class="row mx-3 mt-1 d-block">
            <p class="card-text">August is approaching. Don’t ‘Will’ingly let yourself down<img class="emoji" draggable="false" alt="🍯" src="https://twemoji.maxcdn.com/v/13.0.1/72x72/1f36f.png"/> <br /><br />Boost growth <img class="emoji" draggable="false" alt="✅" src="https://twemoji.maxcdn.com/v/13.0.1/72x72/2705.png"/> <br />Add strength <img class="emoji" draggable="false" alt="✅" src="https://twemoji.maxcdn.com/v/13.0.1/72x72/2705.png"/> <br />Increase thickness and volume <img class="emoji" draggable="false" alt="✅" src="https://twemoji.maxcdn.com/v/13.0.1/72x72/2705.png"/> <br /><br />Preserve the long term health of your hair &amp; supporting skin <img class="emoji" draggable="false" alt="✅" src="https://twemoji.maxcdn.com/v/13.0.1/72x72/2705.png"/> <br /><br />Fill in gaps expeditiously <img class="emoji" draggable="false" alt="✅" src="https://twemoji.maxcdn.com/v/13.0.1/72x72/2705.png"/> <br /><br />Wonderfully scented <img class="emoji" draggable="false" alt="🍬" src="https://twemoji.maxcdn.com/v/13.0.1/72x72/1f36c.png"/><br /><br /><span class="url">http://stonewoodsilk.com</span> </p>                    
        </div>
        <div class="row mx-3 mt-1">
            <p class="card-text"><small class="text-muted">July 28, 2020 9:43 AM</small></p>
    </div>
    
<div class="row">
    <div class="col-sm-12">
        <img src="https://pbs.twimg.com/media/EeACdrXXgAAztPb.jpg" class="img-fluid w-100 rounded-image">
    </div>
  <div class="col-sm-12">
        <img src="https://pbs.twimg.com/media/EeACdrQWAAIj9Yi.jpg" class="img-fluid w-100 rounded-image">
    </div>
  <div class="col-sm-12">
        <img src="https://pbs.twimg.com/media/EeACdrYWkAAa-nK.jpg" class="img-fluid w-100 rounded-image">
    </div>
  <div class="col-sm-12">
        <img src="https://pbs.twimg.com/media/EeACdrRWoAAGbAH.jpg" class="img-fluid w-100 rounded-image">
    </div>
  
</div>


    </div>
</div>
</div>

        </body>
    </html>`

    test('empty buffer is returned when wrong resolution option passed', async () => {
        const expected = new Buffer.alloc(0)

        const result = await puppeteer_utils.getScreenshot(tweet_html_1, 'fake')

        expect(result).toEqual(expected);
    });

    test('correct low res image is returned from html', async () => {

        var expected;
        fs.readFile('test/assets/low-res-test-tweet-1.png', function (err, data) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            fileBuffer = data
        });

        const result = await puppeteer_utils.getScreenshot(tweet_html_1, 'low')

        expect(result).toEqual(fileBuffer);
    });

    test('correct med res image is returned from html', async () => {

        var expected;
        fs.readFile('test/assets/medium-res-test-tweet-1.png', function (err, data) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            fileBuffer = data
        });

        const result = await puppeteer_utils.getScreenshot(tweet_html_1, 'medium')

        expect(result).toEqual(fileBuffer);
    });



} );