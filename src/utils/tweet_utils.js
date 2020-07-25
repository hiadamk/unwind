const Twit = require('twit')
const config = require('config.json')('./config.json');
const twitter = new Twit(config.credentials)
const moment = require('moment');
const runes = require('runes');
const html_utils = require('./html_utils')

module.exports = {
    getTweet: getTweet,
    getTweetImages: getTweetImages,
    getAllTweets : getAllTweets
};

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

async function getAllTweets(id) {
    var tweet = await getTweet(id);
    if (tweet.isError) {
        return [];
    } else {
        if (tweet.isReply && tweet.isQuote){
            return [].concat([await getTweet(tweet.quoted_tweet_id)], [html_utils.addDashedConnector(), tweet, html_utils.addDashedConnector()], await getAllTweets(tweet.in_reply_to_status_id))
        }else if(tweet.isReply){
            return [].concat([tweet, html_utils.addDashedConnector()], await getAllTweets(tweet.in_reply_to_status_id))
        }else if (tweet.isQuote) {
            return [].concat([tweet, html_utils.addDashedConnector()], await getAllTweets(tweet.quoted_tweet_id))
        } else {
            return [].concat([tweet])
        }
    }
}