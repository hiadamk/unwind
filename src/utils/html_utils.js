const regex_utils = require("./regex_utils");
const twemoji = require("twemoji");
const runes = require('runes');

module.exports = {
    addDashedConnector: addDashedConnector,
    formatTweetText : formatTweetText,
    generateImageHTML : generateImageHTML
};

function addDashedConnector() {
    return `
    <div class="container mt-3">
    <div class="vertical-line col-sm-1 col-sm-offset-3">
    </div>
    </div>
    `
}

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

    return twemoji.parse(`
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
`)
}

function formatTweetText(tweet) {

    var text = tweet.full_text;
    const urls = tweet.entities.urls;
    const user_mentions = tweet.entities.user_mentions;
    const hashtags = tweet.entities.hashtags;
    const symbols = tweet.entities.symbols;
    const quoted_tweet_id = tweet.quoted_status_id_str

    text = runes.substr(text, tweet.display_text_range[0], tweet.display_text_range[1] - 1).replace(/\n/g, "<br />");

    var media = null;
    if(tweet.extended_entities != null){
        media = tweet.extended_entities.media;
        for (var i = 0; i < media.length; i++) {
            text = regex_utils.replaceAll(text, media[i].url, '');
        } 
    }

    if(urls != null){
        for (var i = 0; i < urls.length; i++) {
            text = regex_utils.replaceAll(text, urls[i].url, `<span class="url">${urls[i].expanded_url}</span>`);
        }
    }

    for (var i = 0; i < user_mentions.length; i++) {
        text = regex_utils.replaceAll(text, `@${user_mentions[i].screen_name}`, `<span class="url">@${user_mentions[i].screen_name}</span>`)
    }

    for (var i = 0; i < hashtags.length; i++) {
        text = regex_utils.replaceAll(text, `#${hashtags[i].text}`, `<span class="url">#${hashtags[i].text}</span>`);
    }

    var symbolSet = new Set();
    for (var i = 0; i < symbols.length; i++) {
        symbolSet.add(symbols[i].text);
    } 

    symbolSet = Array.from(symbolSet);

    for (var i = 0; i < symbolSet.length; i++) {
        text = regex_utils.replaceAll(text, `$${symbolSet[i]}`, `<span class="url">$${symbolSet[i]}</span>`);
    }

    if(tweet.is_quote_status){
        const url_regex = new RegExp(/<span class="url">https?:\/\/twitter\.com\/\w+\/status(es)?\/(\d+)(\?s=\d+)?<\/span>/g)
        matches = text.match(url_regex)
        if(matches != null){
            for (var i = 0; i < matches.length; i++) {
                if(matches[i].includes(quoted_tweet_id) && tweet.isReply ){
                    text = text.replace(matches[i], '[Quoted Tweet Shown Below]')
                }else{
                    text = text.replace(matches[i], '')
                }
            }
        }
    }

    tweet.tweet_text = text
    return text;
}

function generateImageHTML(tweets){
    var cards_str = "";

        for (var i = 0; i < tweets.length; i++) {
            if (typeof tweets[i] === 'object' && tweets[i] !== null) {
                cards_str = cards_str + generateTweetCard(tweets[i]);
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
                    ${cards_str}
                </body>
            </html>
        `
        return html
}