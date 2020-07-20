const Twit = require('twit')
const config = require('config.json')('./config.json');
const fs = require('fs').promises;
const puppeteer = require('puppeteer');
const path = require('path');
const moment = require('moment');
const runes = require('runes');
 
function generateTweetCard(tweet_details){

    var imagesContent  = "";

    if(tweet_details.media.length > 0){

        var imageDivs = ""  ;
        for (var i = 0; i < tweet_details.media.length; i++) {
            imageDivs = imageDivs + 
            `<div class="col-sm-12">
                <img src="${tweet_details.media[i]}" class="img-fluid rounded-image">
            </div>
          `
        }

        imagesContent = 
        `
        <div class="row">
            ${imageDivs}
        </div>
        
        `
    } 

    return `
    <div class="container mt-3">
        <div class="card">
            <div class="card-body">
                <!-- Header area -->
                <div class="row">
                    <div class="col-2-sm mt-3 ml-4">
                        <img class="avatar m-1" src="${tweet_details.user_display_image}">
                    </div>
                    <div class="col-9-sm mt-3 ml-4">
                        <div class="row mb-0">
                            <p class="mb-1 mt-2">${tweet_details.user}</p>
                        </div>
                        <div class="row">
                            <p class="handle">@${tweet_details.user_handle}</p>
                        </div>
                    </div>
                
                </div>

                <!-- Body Area -->
                
                <div class="row mx-3 mt-1">
                    <p class="card-text">${tweet_details.tweet_text}</p>                    
                </div>
                <div class="row mx-3 mt-1">
                    <p class="card-text"><small class="text-muted">${tweet_details.date.format('LLL')}</small></p>
            </div>
            ${imagesContent}
            </div>
            <!-- <img src="https://static.timesofisrael.com/jewishndev/uploads/2019/11/1186499916.jpg" class="card-img-top"> -->
        </div>
    </div>
`
}

(async () => {
    const twitter = new Twit(config.credentials)

    async function getTweetImages(tweet){

        var photoURLs = [];
        if(tweet.extended_entities == null){
            return photoURLs
        }else{
            const media = tweet.extended_entities.media;
            for (var i = 0; i < media.length; i++) {
                photoURLs.push(media[i].media_url_https);
            }
            return photoURLs;
        }
   
    }

    async function getTweet(id){
        const tweet = await twitter.get('statuses/show/:id', { id: id, tweet_mode : 'extended' }).catch((error) => {return {'data' : error.message, 'isError' : true}})
        if(tweet.isError){
            return tweet
        }else{
            var media = await getTweetImages(tweet.data)
            return {
                'tweet_text' : runes.substr(tweet.data.full_text, tweet.data.display_text_range[0], tweet.data.display_text_range[1]).replace(/\n/g, "<br />"),
                'user' : tweet.data.user.name,
                'user_handle' : tweet.data.user.screen_name,
                'user_display_image' : tweet.data.user.profile_image_url_https,
                'date' : moment(tweet.data.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en'),
                'media' : media,
                'isQuote': tweet.data.is_quote_status,
                'quoted_tweet_id' :  tweet.data.quoted_status_id_str
            }
        }
    }

    function addDashedConnector(){
        return `
        <div class="container mt-3">
        <div class="vertical-line col-sm-1 col-sm-offset-3">
        </div>
        </div>
        `
    }

    async function getAllTweets(id){
        var tweets =  [];
        
        var tweet = await getTweet(id);
        var isQuote = true;
        while(isQuote){
            if(tweet.isError){
                isQuote = false;
            }else{
                tweets.push(tweet);
                if(tweet.isQuote){
                    tweet = await getTweet(tweet.quoted_tweet_id);
                    tweets.push(addDashedConnector())
                    isQuote = true;
                }else{
                    isQuote = false;
                }
            }
        }

        return tweets.reverse();
    }

    const tweets = await getAllTweets('1285236665867554818');

    if(tweets.length == 0){
        console.log("Unable to find tweet")
    }else{
        var cards_str = "";

        for (var i = 0; i < tweets.length; i++) {
            if(typeof tweets[i] === 'object' && tweets[i] !== null ){
                cards_str = cards_str + generateTweetCard(tweets[i])
            }else{
                cards_str = cards_str + tweets[i]
            }
            
        }

        const html = 
        `
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <!-- Required meta tags -->
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                
                    <!-- Bootstrap CSS -->
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="styles.css">
                    <title>Tweet</title>
                    
                </head>
                <body>
                    ${cards_str}
                </body>
            </html>
        `
        
        fs.writeFile("./generated/tweet.html", html, {encoding: 'utf-8'})
        .then((data) => {})
        .catch((err) => {
            console.log(err);
        });
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({width: 1440, height: 900, deviceScaleFactor: 2});
        await page.goto(`file:${path.join(__dirname, './generated/tweet.html')}`);
        await page.screenshot({path: './generated/tweet.png', fullPage: true });
        await browser.close();

    }
})();