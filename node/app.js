const Twit = require('twit')
const config = require('config.json')('./config.json');
const fs = require('fs').promises;
const puppeteer = require('puppeteer');
const path = require('path');
const moment = require('moment');
const runes = require('runes');

function generateTweetCard(tweet_details) {

    var imagesContent = "";

    if (tweet_details.media.length > 0) {

        var imageDivs = "";
        for (var i = 0; i < tweet_details.media.length; i++) {
            imageDivs = imageDivs +
                `<div class="col-sm-12">
                <img src="${tweet_details.media[i]}" class="img-fluid w-100 rounded-image">
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
    <div class="container my-3">
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
                
                <div class="row mx-3 mt-1 d-block">
                    <p class="card-text">${tweet_details.tweet_text}</p>                    
                </div>
                <div class="row mx-3 mt-1">
                    <p class="card-text"><small class="text-muted">${tweet_details.date.format('LLL')}</small></p>
            </div>
            ${imagesContent}
            </div>
        </div>
    </div>
`
}

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find) + '\\b', 'g'), replace);
}

(async () => {
    const twitter = new Twit(config.credentials)

    async function getTweetImages(tweet) {

        var photoURLs = [];
        if (tweet.extended_entities == null) {
            return photoURLs
        } else {
            const media = tweet.extended_entities.media;
            for (var i = 0; i < media.length; i++) {
                photoURLs.push(media[i].media_url_https);
            }
            return photoURLs;
        }

    }

    async function getTweet(id) {
        const tweet = await twitter.get('statuses/show/:id', { id: id, tweet_mode: 'extended' }).catch((error) => { return { 'data': error.message, 'isError': true } })
        if (tweet.isError) {
            return tweet
        } else {
            return {
                'tweet_text': runes.substr(tweet.data.full_text, tweet.data.display_text_range[0], tweet.data.display_text_range[1]).replace(/\n/g, "<br />"),
                'user': tweet.data.user.name,
                'user_handle': tweet.data.user.screen_name,
                'user_display_image': tweet.data.user.profile_image_url_https.replace('_normal', ''),
                'date': moment(tweet.data.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en'),
                'urls': tweet.data.entities.urls,
                'user_mentions': tweet.data.entities.user_mentions,
                'hashtags': tweet.data.entities.hashtags,
                'symbols': tweet.data.entities.symbols,
                'media': await getTweetImages(tweet.data),
                'isQuote': tweet.data.is_quote_status,
                'quoted_tweet_id': tweet.data.quoted_status_id_str,
                'in_reply_to_status_id': tweet.data.in_reply_to_status_id_str,
                'isReply' : tweet.data.in_reply_to_status_id_str != null
            }
        }
    }

    function addDashedConnector() {
        return `
        <div class="container mt-3">
        <div class="vertical-line col-sm-1 col-sm-offset-3">
        </div>
        </div>
        `
    }

    function formatTweetText(tweetDetails) {

        var tweet = tweetDetails;
        var text = tweet.tweet_text;
        const urls = tweet.urls;
        const user_mentions = tweet.user_mentions;
        const hashtags = tweet.hashtags;
        const symbols = tweet.symbols;
        const quoted_tweet_id = tweet.quoted_tweet_id

        for (var i = 0; i < urls.length; i++) {
            text = replaceAll(text, urls[i].url, `<span class="url">${urls[i].expanded_url}</span>`);
        }

        for (var i = 0; i < user_mentions.length; i++) {
            text = replaceAll(text, `@${user_mentions[i].screen_name}`, `<span class="url">@${user_mentions[i].screen_name}</span>`)
        }

        for (var i = 0; i < hashtags.length; i++) {
            text = replaceAll(text, `#${hashtags[i].text}`, `<span class="url">#${hashtags[i].text}</span>`);
        }

        for (var i = 0; i < symbols.length; i++) {
            text = replaceAll(text, `$${symbols[i].text}`, `<span class="url">$${symbols[i].text}</span>`)
        }

        if(tweet.isQuote){
            const url_regex = new RegExp(/<span class="url">https?:\/\/twitter\.com\/\w+\/status(es)?\/(\d+)(\?s=\d+)?<\/span>/g)
            matches = text.match(url_regex)
            for (var i = 0; i < matches.length; i++) {
                if(matches[i].includes(quoted_tweet_id)){
                    text = text.replace(matches[i], '[Quoted Tweet Shown Below]')
                }
            }
        }

        tweet.tweet_text = text
        return text;
    }

    async function getAllTweets(id) {
        var tweet = await getTweet(id);
        if (tweet.isError) {
            return [];
        } else {
            if (tweet.isReply && tweet.isQuote){
                quoted_tweet = await getTweet(tweet.quoted_tweet_id);
                return [].concat([quoted_tweet], [addDashedConnector(), tweet, addDashedConnector()], await getAllTweets(tweet.in_reply_to_status_id))
            }else if(tweet.isReply){
                return [].concat([tweet, addDashedConnector()], await getAllTweets(tweet.in_reply_to_status_id))
            }else if (tweet.isQuote) {
                return [].concat([tweet, addDashedConnector()], await getAllTweets(tweet.quoted_tweet_id))
            } else {
                return [].concat([tweet])
            }
        }
    }

    const tweet_id = '1275125994190495744'
    var tweets = await getAllTweets(tweet_id);
    tweets = tweets.reverse();

    if (tweets.length == 0) {
        console.log("Unable to find tweet")
    } else {
        var cards_str = "";

        for (var i = 0; i < tweets.length; i++) {
            if (typeof tweets[i] === 'object' && tweets[i] !== null) {
                tweets[i].tweet_text = formatTweetText(tweets[i])
                cards_str = cards_str + generateTweetCard(tweets[i])
            } else {
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

        fs.writeFile("./generated/tweet.html", html, { encoding: 'utf-8' })
            .then((data) => { })
            .catch((err) => {
                console.log(err);
            });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 600, height: 400, deviceScaleFactor: 2 });

        // await page.goto(`file:${path.join(__dirname, './generated/tweet.html')}`);
        await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' });
        await page.screenshot({ path: `./generated/tweet-${tweet_id}.png`, fullPage: true });
        await browser.close();

    }
})();