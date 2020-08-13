const Twit = require('twit')
const twitter = new Twit({
    consumer_key:         process.env.twitter_consumer_key,
    consumer_secret:      process.env.twitter_consumer_secret,
    access_token:         process.env.twitter_access_token,
    access_token_secret:  process.env.twitter_access_token_secret,
    timeout_ms:           process.env.twitter_timeout_ms,
})
const moment = require('moment');
const runes = require('runes');
const html_utils = require('./html_utils')

module.exports = {
    getTweet: getTweet,
    getAllTweets : getAllTweets
};

async function getTweet(id) {
    const tweet = await twitter.get('statuses/show/:id', { id: id, tweet_mode: 'extended' }).catch((error) => { return { 'data': error, 'isError': true } })
    if (tweet.isError) {
        if(tweet.data.statusCode == 403 && tweet.data.code == 179){
            return {
                'tweet_text': 'Unable to get tweets from private account',
                'user': 'Private Account',
                'user_handle': 'private',
                'user_display_image': 'https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg',
                'date': moment(),
                'urls': [],
                'user_mentions': [],
                'hashtags': [],
                'symbols': [],
                'media': [],
                'isQuote': false,
                'quoted_tweet_id': null,
                'in_reply_to_status_id': null,
                'isReply' : false
            }
        }
        return tweet
    } else {
        // console.log(tweet.data)
        console.log(tweet.data.entities.urls)
        // console.log(tweet.data.entities.media)

        return {
            'tweet_text': html_utils.formatTweetText(tweet.data),
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
        };
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