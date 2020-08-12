module.exports = {
    replaceAll: replaceAll,
    getTweetId : getTweetId,
};

const tweet_url_regex = new RegExp(/https?:\/\/twitter\.com\/\w+\/status(es)?\/(\d+)(\?s=\d+)?/)

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find) + '\\b', 'g'), replace);
}

function getTweetId(url){
    match = url.match(tweet_url_regex);

    if(match != null){
        return match[2];
    }else{
        return null;
    }
}