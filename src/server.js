const express = require('express');
const tweet_utils = require('./utils/tweet_utils');
const regex_utils = require('./utils/regex_utils');
const html_utils = require('./utils/html_utils');
const pupeteer_utils = require('./utils/puppeteer_utils');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.post('/api/tweet/', async function(req, res){

  if(req.body.url == null || req.body.resolution == null){
    res.send({'is_err' : true, 'err_msg' : 'No Url'})
    return
  }
  const tweet_id = regex_utils.getTweetId(req.body.url)
  if(tweet_id == null){
    res.send({'is_err' : true, 'err_msg' : 'Poor Tweet Id'})
    return
  }
  const tweets = await tweet_utils.getAllTweets(tweet_id);
  tweets.reverse();
  const html = html_utils.generateImageHTML(tweets);
  const image = await pupeteer_utils.getScreenshot(html, req.body.resolution.toLowerCase());
  res.contentType('image/png');
  res.send(image);
})

app.listen(process.env.PORT,function() {
    console.log('Server is Live')
});